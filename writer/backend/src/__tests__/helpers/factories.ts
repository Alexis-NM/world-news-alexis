// =============================================================================
// Factories de données de test — Writer Backend
// =============================================================================
//
// POURQUOI DES FACTORIES ?
//
// Sans factories, chaque test recrée manuellement ses données :
//
//   const data = {
//     title: "Mon Article",
//     subtitle: "Sous-titre",
//     subhead: "Chapeau",
//     body: "Contenu",
//     categoryId: 1,
//   };
//
// Problèmes :
//   1. Duplication : ces 6 lignes sont copiées dans chaque test
//   2. Maintenance : si on ajoute un champ obligatoire, il faut modifier
//      chaque test qui crée un article
//   3. Bruit : le lecteur ne voit pas ce qui est important dans le test
//      car les données "standard" masquent les données spécifiques au test
//
// Les factories résolvent ces 3 problèmes :
//   - Valeurs par défaut sensées → pas de duplication
//   - Un seul endroit à modifier si le schéma change → maintenance facile
//   - Le paramètre `overrides` met en évidence CE QUI COMPTE dans le test
//
// EXEMPLE :
//   buildCreateArticleDTO()                       → article avec valeurs par défaut
//   buildCreateArticleDTO({ title: "" })           → article avec titre vide (test validation)
//   buildCreateArticleDTO({ title: "a".repeat(301) }) → article avec titre trop long
//
// =============================================================================

import type { CreateArticleDTO } from "../../types/article.types.js";

// Note : "../../" remonte de helpers/ → __tests__/ → src/ puis descend dans types/

/**
 * Construit un DTO de création d'article avec des valeurs par défaut.
 * Chaque appel produit des valeurs identiques sauf les overrides spécifiés.
 *
 * @param overrides - Champs à remplacer par des valeurs spécifiques au test
 * @returns Un objet CreateArticleDTO prêt à être passé au service ou à l'API
 */
export function buildCreateArticleDTO(
	overrides: Partial<CreateArticleDTO> = {},
): CreateArticleDTO {
	return {
		// categoryId 1 = "International" (première catégorie du seed SQL)
		title: "Article de test",
		subtitle: "Sous-titre de test",
		subhead: "Chapeau de test pour vérifier le fonctionnement",
		body: "Contenu de l'article de test, suffisamment long pour être réaliste.",
		categoryId: 1,
		...overrides,
	};
}

/**
 * Génère un titre unique en ajoutant un suffixe aléatoire.
 * Utile quand on crée plusieurs articles dans un même test
 * (la colonne title a une contrainte UNIQUE en base).
 */
export function uniqueTitle(base = "Article"): string {
	return `${base} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
