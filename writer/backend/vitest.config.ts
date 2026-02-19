// =============================================================================
// Configuration Vitest — Writer Backend
// =============================================================================
//
// CE FICHIER CONFIGURE LE FRAMEWORK DE TESTS VITEST.
//
// Vitest est le runner de tests officiel de l'écosystème Vite. Il est
// compatible avec l'API de Jest (describe, it, expect) mais démarre beaucoup
// plus vite grâce au bundler Vite sous le capot.
//
// Documentation : https://vitest.dev/config/
//
// =============================================================================

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// ─── globals ────────────────────────────────────────────────────────
		// Rend describe(), it(), expect(), beforeAll(), etc. disponibles
		// dans tous les fichiers de test SANS avoir à les importer.
		// Sans ça, il faudrait écrire `import { describe, it } from "vitest"`
		// en haut de chaque fichier de test.
		globals: true,

		// ─── environment ────────────────────────────────────────────────────
		// Définit l'environnement d'exécution des tests.
		//   "node"  → API Node.js (fs, http, process...) — pour les backends
		//   "jsdom" → simule un navigateur (DOM, window...) — pour les frontends
		// Ici c'est un backend Express, donc on utilise "node".
		environment: "node",

		// ─── include ────────────────────────────────────────────────────────
		// Pattern glob qui définit quels fichiers sont des tests.
		// Seuls les fichiers dans src/__tests__/ qui finissent par .test.ts
		// seront exécutés par Vitest.
		include: ["src/__tests__/**/*.test.ts"],

		// ─── fileParallelism ────────────────────────────────────────────────
		// Exécute les fichiers de test en séquence, pas en parallèle.
		// Nécessaire car les tests articles et Gemini partagent le même
		// objet Express `app` et la même connexion TypeORM. En parallèle,
		// le vi.mock de Gemini peut interférer avec l'import de app.ts
		// dans les tests articles.
		// Les tests DANS un même fichier restent parallélisables.
		fileParallelism: false,

		// ─── setupFiles ─────────────────────────────────────────────────────
		// Fichiers exécutés AVANT chaque fichier de test.
		// C'est ici qu'on initialise la connexion à la base de données de test
		// et qu'on configure le nettoyage entre les tests (isolation).
		setupFiles: ["src/__tests__/setup/test-setup.ts"],

		// ─── env ────────────────────────────────────────────────────────────
		// Variables d'environnement injectées dans les workers de test.
		// Ces variables pointent vers la base de données de TEST (port 5433)
		// créée par docker-compose.test.yml, et NON la base de dev (5432).
		//
		// IMPORTANT : ces variables sont lues par src/config/database.ts
		// au moment de l'import. Vitest les injecte AVANT l'exécution des
		// tests, donc TypeORM se connecte automatiquement à la bonne base.
		env: {
			NODE_ENV: "test",
			DB_HOST: "localhost",
			DB_PORT: "5433",
			DB_NAME: "worldnews_test",
			DB_USER: "postgres",
			DB_PASSWORD: "postgres",
		},
	},
});
