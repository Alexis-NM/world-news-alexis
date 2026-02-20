// =============================================================================
// Tests d'intégration — Reader API
// =============================================================================
//
// Le reader est une API en lecture seule. Il consulte une vue matérialisée
// PostgreSQL (reader.v_articles) alimentée par les données de seed.
//
// Contrairement au writer, il n'y a pas de TRUNCATE entre les tests :
// les données ne sont jamais modifiées, donc l'isolation est naturelle.
//
// La vue reader.v_articles reflète l'état de writer.t_articles en temps réel.
// Quand le hook pre-push exécute les tests writer AVANT reader, le TRUNCATE
// du writer réduit le nombre d'articles. Les assertions vérifient donc le
// comportement (tableau, max 10) plutôt qu'un compte exact lié au seed.
// =============================================================================

import request from "supertest";
import app from "../app.js";

describe("Reader API", () => {
	// ─── GET /articles ────────────────────────────────────────────────────

	describe("GET /articles", () => {
		it("articles existants → 200 + tableau de 10 articles max", async () => {
			// ACT
			const res = await request(app).get("/articles");

			// ASSERT
			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
			expect(res.body.length).toBeGreaterThan(0);
			expect(res.body.length).toBeLessThanOrEqual(10);
		});

		it("chaque article contient les champs attendus (contrat d'API)", async () => {
			// ACT
			const res = await request(app).get("/articles");

			// ASSERT — structure du premier article
			expect(res.body[0]).toEqual(
				expect.objectContaining({
					id: expect.any(Number),
					title: expect.any(String),
					subtitle: expect.any(String),
					subhead: expect.any(String),
					publish_date: expect.any(String),
				}),
			);
		});
	});

	// ─── GET /articles/:id ────────────────────────────────────────────────

	describe("GET /articles/:id", () => {
		it("article existant → 200 + données complètes", async () => {
			// ARRANGE — récupère un id existant dynamiquement
			const list = await request(app).get("/articles");
			const articleId = list.body[0].id;

			// ACT
			const res = await request(app).get(`/articles/${articleId}`);

			// ASSERT
			expect(res.status).toBe(200);
			expect(res.body.id).toBe(articleId);
			expect(res.body.title).toBeDefined();
			expect(res.body.body).toBeDefined();
		});

		it("article inexistant → 404 + message d'erreur", async () => {
			// ACT
			const res = await request(app).get("/articles/99999");

			// ASSERT
			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Article non trouvé");
		});
	});
});
