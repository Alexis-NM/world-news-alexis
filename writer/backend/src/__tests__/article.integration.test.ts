// =============================================================================
// Tests d'intégration — Writer API
// =============================================================================
//
// POURQUOI UN SEUL FICHIER DE TESTS ?
//
// On pourrait séparer "tests unitaires du service" et "tests d'intégration
// de l'API". Mais avec une vraie base de données, les tests du service
// traversent DÉJÀ toutes les couches (service → repository → DB).
// Ajouter une couche HTTP par-dessus (supertest) ne coûte quasiment rien
// en temps et teste le chemin COMPLET qu'un utilisateur emprunte :
//
//   Requête HTTP → Express → Middleware → Controller → Service → Repository → DB
//
// Résultat : on évite les doublons entre deux fichiers qui testeraient
// la même chose à des niveaux d'entrée différents.
//
// =============================================================================
//
// SUPERTEST : TESTER UNE API SANS LANCER LE SERVEUR
//
// Supertest prend directement l'objet Express `app` et simule des requêtes
// HTTP sans ouvrir de port réseau. C'est plus rapide et plus fiable que
// de lancer le serveur sur un port et de faire des fetch().
//
// =============================================================================
//
// STRATÉGIE DE TEST : UN TEST PAR PATTERN
//
// On ne teste pas chaque champ × chaque règle de validation. On teste
// chaque PATTERN de validation une seule fois :
//   - Champ manquant  → testé via title (le pattern est le même pour tous)
//   - Champ espaces   → testé via title (trim + vide = même logique partout)
//   - Unicité         → testé via title (seul champ avec contrainte unique)
//
// On ne teste PAS les guards triviaux (parseInt d'un ID, if (!param)),
// ni les variantes du même pattern (longueur max = même if() que vide).
//
// Si un test passe pour title, on peut faire confiance au même if() pour
// subtitle, subhead, etc. Tester chaque champ séparément ne trouverait
// un bug que si on avait copié-collé le if() avec une faute de frappe,
// ce qui n'est pas un scénario réaliste.
//
// =============================================================================
//
// CONVENTION DE NOMMAGE : <condition> → <résultat attendu>
//
// Le tuto (05-tests-unitaires/nommage.md) recommande :
//   test_<quoi>_<condition>_<résultat attendu>
//
// En Vitest, le describe() porte déjà le "quoi" (l'endpoint testé),
// donc le it() ne contient que la condition et le résultat attendu :
//
//   describe("POST /api/articles")
//     it("données valides → 201 + article créé")
//     it("titre dupliqué → 400")
//
// À la lecture du rapport de tests, on obtient :
//   POST /api/articles > données valides → 201 + article créé     ✓
//   POST /api/articles > titre dupliqué → 400                     ✓
//
// =============================================================================

import request from "supertest";
import app from "../app.js";
import { buildCreateArticleDTO, uniqueTitle } from "./helpers/factories.js";

describe("Writer API", () => {
	// ─── POST /api/articles ────────────────────────────────────────────────

	describe("POST /api/articles", () => {
		it("données valides → 201 + article créé", async () => {
			const title = uniqueTitle("POST-201");
			const data = buildCreateArticleDTO({ title });

			const res = await request(app).post("/api/articles").send(data);

			expect(res.status).toBe(201);
			expect(res.body.message).toBe("Article créé avec succès");
			expect(res.body.data.title).toBe(title);
			expect(res.body.data.category).toBeDefined();
		});

		it("champs obligatoires manquants → 400", async () => {
			// Vérifie la validation du CONTROLLER (avant le service).
			// Le controller fait : if (!title || !subtitle || ...)
			const res = await request(app).post("/api/articles").send({
				title: "Seulement un titre",
			});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty("error");
		});

		it("titre composé uniquement d'espaces → 400", async () => {
			// Edge case : "   " passe le check du controller (!title est false
			// car la string n'est pas vide) mais le SERVICE détecte que
			// title.trim() est vide. Teste le chemin controller → service.
			const data = buildCreateArticleDTO({ title: "   " });

			const res = await request(app).post("/api/articles").send(data);

			expect(res.status).toBe(400);
		});

		it("titre dupliqué → 400", async () => {
			// ARRANGE : créer un premier article
			const title = uniqueTitle("Doublon");
			await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));

			// ACT : tenter de créer un second avec le même titre
			const res = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));

			// ASSERT : le service fait un SELECT avant l'INSERT
			// et détecte le doublon → 400
			expect(res.status).toBe(400);
		});

		it("espaces autour des champs → données trimées", async () => {
			const baseTitle = uniqueTitle("Trim");
			const data = buildCreateArticleDTO({
				title: `  ${baseTitle}  `,
				body: "  Contenu avec espaces  ",
			});

			const res = await request(app).post("/api/articles").send(data);

			// ASSERT : les données renvoyées sont trimées
			expect(res.status).toBe(201);
			expect(res.body.data.title).toBe(baseTitle);
			expect(res.body.data.body).toBe("Contenu avec espaces");
		});
	});

	// ─── GET /api/articles ─────────────────────────────────────────────────

	describe("GET /api/articles", () => {
		it("articles existants → 200 + pagination cohérente", async () => {
			// ARRANGE : créer 2 articles pour avoir des données réelles
			await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title: uniqueTitle("List-1") }));
			await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title: uniqueTitle("List-2") }));

			// ACT
			const res = await request(app).get("/api/articles");

			// ASSERT : la pagination reflète les articles créés
			expect(res.status).toBe(200);
			expect(res.body.articles.length).toBe(2);
			expect(res.body.pagination.total).toBe(2);
			expect(res.body.pagination.page).toBe(1);
		});
	});

	// ─── GET /api/articles/:id ─────────────────────────────────────────────

	describe("GET /api/articles/:id", () => {
		it("article existant → 200 + données complètes", async () => {
			// ARRANGE : créer un article pour avoir un id valide
			const title = uniqueTitle("GET-200");
			const created = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));
			const articleId = created.body.data.id;

			const res = await request(app).get(`/api/articles/${articleId}`);

			expect(res.status).toBe(200);
			expect(res.body.data.title).toBe(title);
		});

		it("article inexistant → 404", async () => {
			const res = await request(app).get("/api/articles/99999");

			expect(res.status).toBe(404);
			expect(res.body.error).toBe("Article non trouvé");
		});
	});

	// ─── PATCH /api/articles/:id ───────────────────────────────────────────

	describe("PATCH /api/articles/:id", () => {
		it("titre modifié → 200 + update_date renseigné", async () => {
			// ARRANGE
			const title = uniqueTitle("PATCH-avant");
			const created = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));
			const articleId = created.body.data.id;
			const newTitle = uniqueTitle("PATCH-après");

			// ACT
			const res = await request(app)
				.patch(`/api/articles/${articleId}`)
				.send({ title: newTitle });

			// ASSERT : le titre a changé ET update_date a été renseigné
			// (logique métier du service, vérifiée de bout en bout)
			expect(res.status).toBe(200);
			expect(res.body.message).toBe("Article mis à jour avec succès");
			expect(res.body.data.update_date).not.toBeNull();
		});
	});

	// ─── PATCH /api/articles/:id/delete + restore ──────────────────────────
	// On teste le cycle complet delete → restore dans un seul test.
	// Ça évite la duplication (deux tests qui font chacun create + setup)
	// et ça vérifie le vrai scénario utilisateur : supprimer puis restaurer.

	describe("PATCH soft-delete et restore", () => {
		it("delete puis restore → article ré-accessible", async () => {
			// ARRANGE
			const title = uniqueTitle("Cycle");
			const created = await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title }));
			const articleId = created.body.data.id;

			// ACT 1 : soft-delete
			const deleteRes = await request(app).patch(
				`/api/articles/${articleId}/delete`,
			);

			expect(deleteRes.status).toBe(200);
			expect(deleteRes.body.message).toBe("Article supprimé avec succès");

			// ACT 2 : restore
			const restoreRes = await request(app).patch(
				`/api/articles/${articleId}/restore`,
			);

			expect(restoreRes.status).toBe(200);
			expect(restoreRes.body.message).toBe("Article restoré avec succès");

			// ASSERT : l'article est bien ré-accessible après restore
			const getRes = await request(app).get(`/api/articles/${articleId}`);
			expect(getRes.status).toBe(200);
			expect(getRes.body.data.title).toBe(title);
		});
	});

	// ─── GET /api/articles/search ──────────────────────────────────────────

	describe("GET /api/articles/search", () => {
		it("mot-clé existant → articles correspondants", async () => {
			// ARRANGE : créer un article avec un mot-clé unique
			const keyword = `Unique${Date.now()}`;
			await request(app)
				.post("/api/articles")
				.send(buildCreateArticleDTO({ title: keyword }));

			const res = await request(app).get(`/api/articles/search?q=${keyword}`);

			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBeGreaterThanOrEqual(1);
		});
	});
});
