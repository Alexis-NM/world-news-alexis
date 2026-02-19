// =============================================================================
// Tests d'intégration — Gemini API (service externe mocké)
// =============================================================================
//
// POURQUOI UN MOCK ICI (ET PAS DANS LES TESTS ARTICLES) ?
//
// Le guide (04-test-doubles/quand-mocker.md) pose la règle :
//   - Service EXTERNE (API tierce, email, Stripe…) → mockez ✅
//   - VOTRE code (BD, routes, logique métier)       → testez en vrai ❌
//
// Google Gemini est un service externe : on ne contrôle ni sa disponibilité,
// ni son coût par appel, ni la stabilité de ses réponses. Le mocker est
// donc le SEUL cas de mock justifié dans ce projet.
//
// Les tests articles n'ont aucun mock : ils traversent la vraie BD via
// Docker tmpfs. Ici, on remplace uniquement le SDK Google par un fake.
//
// =============================================================================
//
// COMMENT FONCTIONNE vi.mock ?
//
// vi.mock() est "hoisted" par Vitest : peu importe où il est écrit dans
// le fichier, il est exécuté AVANT tous les imports. C'est crucial ici
// car la chaîne d'imports est :
//
//   app.ts → routes/index.ts → gemini.route.ts → gemini.controller.ts
//   → gemini.service.ts → new GeminiService() → new GoogleGenerativeAI()
//
// Sans mock, le constructeur GeminiService lève une erreur car
// GEMINI_API_KEY n'existe pas en environnement de test.
// Avec vi.mock, le SDK est remplacé AVANT que cette chaîne ne s'exécute.
//
// =============================================================================
//
// STRATÉGIE : UN TEST PAR PATTERN (même logique que les tests articles)
//
// Les 4 endpoints Gemini suivent le même pattern :
//   - Controller : if (!body) → 400
//   - Service : if (body.trim().length < 50) → 400 (ValidationError)
//   - Service : appel SDK → 200 + texte généré
//
// On teste chaque pattern UNE FOIS via generate-titre. Les autres
// endpoints (sous-titre, chapeau, body) ont le même if() et le même
// flow — les re-tester n'apporterait rien.
//
// =============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest";

// ─── Mock du SDK Google Generative AI ───────────────────────────────────────
// Ce mock remplace le module @google/generative-ai par un fake.
//
// PIÈGE DU HOISTING : vi.mock() est exécuté AVANT les déclarations de
// variables du fichier. On ne peut donc pas référencer une variable
// externe (const mockFn = vi.fn()) dans la factory du mock — elle
// n'existe pas encore. La solution : utiliser vi.hoisted() qui déclare
// des variables dans la même phase que vi.mock.
//
// Note technique : GoogleGenerativeAI est appelé avec `new` dans le code
// source. Une arrow function ne peut pas être constructeur en JS.
// On utilise donc une class dans le mock.

const { mockGenerateContent } = vi.hoisted(() => ({
	mockGenerateContent: vi.fn(),
}));

vi.mock("@google/generative-ai", () => ({
	GoogleGenerativeAI: class {
		getGenerativeModel() {
			return { generateContent: mockGenerateContent };
		}
	},
}));

import request from "supertest";
import app from "../app.js";

// ─── Helper : simule une réponse Gemini réussie ─────────────────────────────
function mockGeminiResponse(text: string) {
	mockGenerateContent.mockResolvedValue({
		response: { text: () => text },
	});
}

// ─── Helper : body de 50+ caractères (seuil minimum du service) ─────────────
const VALID_BODY =
	"Ceci est un contenu d'article suffisamment long pour passer la validation du service Gemini.";

describe("Gemini API (service externe mocké)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	// ─── POST /api/gemini/generate-titre ──────────────────────────────────

	describe("POST /api/gemini/generate-titre", () => {
		it("body valide → 200 + titre généré", async () => {
			// ARRANGE
			mockGeminiResponse("Titre généré par l'IA");

			// ACT
			const res = await request(app)
				.post("/api/gemini/generate-titre")
				.send({ body: VALID_BODY });

			// ASSERT
			expect(res.status).toBe(200);
			expect(res.body.message).toBe("Titre généré avec succès");
			expect(res.body.data).toBe("Titre généré par l'IA");
			expect(mockGenerateContent).toHaveBeenCalledOnce();
		});

		it("body manquant → 400 (validation controller)", async () => {
			// Le controller vérifie if (!body) AVANT d'appeler le service.
			// Le mock ne devrait jamais être appelé.
			const res = await request(app)
				.post("/api/gemini/generate-titre")
				.send({});

			expect(res.status).toBe(400);
			expect(res.body.error).toContain("body");
			expect(mockGenerateContent).not.toHaveBeenCalled();
		});

		it("body trop court (< 50 chars) → 400 (validation service)", async () => {
			// Le controller laisse passer (body est truthy), mais le SERVICE
			// détecte que body.trim().length < 50 et lève une ValidationError.
			const res = await request(app)
				.post("/api/gemini/generate-titre")
				.send({ body: "Texte trop court" });

			expect(res.status).toBe(400);
			expect(mockGenerateContent).not.toHaveBeenCalled();
		});
	});
});
