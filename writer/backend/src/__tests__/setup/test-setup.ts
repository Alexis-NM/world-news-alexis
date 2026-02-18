// =============================================================================
// Setup global des tests — Writer Backend
// =============================================================================
//
// CE FICHIER S'EXÉCUTE AVANT CHAQUE FICHIER DE TEST.
//
// Il gère le cycle de vie de la connexion à la base de données de test :
//   1. beforeAll  → ouvre la connexion TypeORM vers la DB de test (Docker tmpfs)
//   2. afterEach  → nettoie les données entre chaque test (isolation)
//   3. afterAll   → ferme la connexion proprement
//
// =============================================================================
//
// POURQUOI L'ISOLATION ENTRE LES TESTS EST CRITIQUE
//
// Chaque test doit être indépendant (principe FIRST : Independent).
// Si un test crée un article, il ne doit pas affecter les autres tests.
// Sans nettoyage, l'ordre d'exécution des tests changerait les résultats,
// ce qui rendrait les tests "flaky" (parfois verts, parfois rouges).
//
// On utilise TRUNCATE (suppression rapide de toutes les lignes) après chaque
// test pour garantir que chaque test démarre avec une table articles vide.
// Les catégories (données de référence) sont conservées car elles viennent
// des scripts SQL d'initialisation et ne changent pas entre les tests.
//
// =============================================================================

import { AppDataSource } from "../../config/database.js";

// Note sur les chemins d'import :
// Ce fichier est dans src/__tests__/setup/, donc "../../" remonte à src/
// puis descend dans config/. L'extension .js est requise par le module
// système "nodenext" de TypeScript (même si le fichier source est .ts).

// ─── beforeAll : connexion à la DB de test ─────────────────────────────────
// S'exécute UNE SEULE FOIS avant tous les tests du fichier.
// Initialise la connexion TypeORM vers la DB de test (port 5433).
// Si la connexion échoue, tous les tests du fichier sont sautés.
beforeAll(async () => {
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
	}
});

// ─── afterEach : nettoyage entre les tests ─────────────────────────────────
// S'exécute APRÈS CHAQUE test (pas après chaque describe, après chaque it).
// TRUNCATE supprime toutes les lignes de writer.t_articles instantanément.
// CASCADE supprime aussi les données liées dans d'autres tables si nécessaire.
// RESTART IDENTITY remet les compteurs auto-incrémentés (id) à 1.
//
// On ne truncate PAS t_categories car ce sont des données de référence
// stables (International, Économie, etc.) insérées par les scripts SQL.
afterEach(async () => {
	if (AppDataSource.isInitialized) {
		await AppDataSource.query(
			"TRUNCATE writer.t_articles RESTART IDENTITY CASCADE",
		);
	}
});

// ─── afterAll : fermeture de la connexion ──────────────────────────────────
// S'exécute UNE SEULE FOIS après tous les tests du fichier.
// Ferme proprement la connexion TypeORM pour libérer les ressources.
// Sans ça, le processus de test resterait suspendu indéfiniment.
afterAll(async () => {
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
	}
});
