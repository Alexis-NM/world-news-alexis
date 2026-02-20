// =============================================================================
// Tests unitaires — Schéma de validation Joi (article)
// =============================================================================
//
// On teste ici NOTRE configuration Joi, pas le framework Joi lui-même.
// Ces règles définissent le contrat de validation du paramètre :id
// sur la route GET /articles/:id.
//
// Pas de base de données, pas de serveur : ce sont des tests unitaires purs.
// =============================================================================

import { getArticleByIdSchema } from "../schemas/article.schema.js";

describe("Schema getArticleById", () => {
	// ─── Happy path ──────────────────────────────────────────────────────

	it("id entier positif → valide", () => {
		// ACT
		const { error } = getArticleByIdSchema.validate({ id: 1 });

		// ASSERT
		expect(error).toBeUndefined();
	});

	// ─── Error paths ─────────────────────────────────────────────────────

	it("id string → erreur 'doit être un nombre'", () => {
		// ACT
		const { error } = getArticleByIdSchema.validate({ id: "abc" });

		// ASSERT
		expect(error).toBeDefined();
		expect(error!.details[0].message).toBe("L'ID doit être un nombre");
	});

	it("id négatif → erreur 'doit être positif'", () => {
		// ACT
		const { error } = getArticleByIdSchema.validate({ id: -1 });

		// ASSERT
		expect(error).toBeDefined();
		expect(error!.details[0].message).toBe("L'ID doit être positif");
	});

	it("id décimal → erreur 'doit être un entier'", () => {
		// ACT
		const { error } = getArticleByIdSchema.validate({ id: 1.5 });

		// ASSERT
		expect(error).toBeDefined();
		expect(error!.details[0].message).toBe("L'ID doit être un entier");
	});
});
