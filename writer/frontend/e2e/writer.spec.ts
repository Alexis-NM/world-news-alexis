// =============================================================================
// Tests E2E — Writer Frontend
// =============================================================================
//
// Scénarios utilisateur réels testés avec Playwright (navigateur headless).
// On vérifie les parcours critiques : consultation de la liste d'articles
// et accès au formulaire de création.
//
// Pré-requis : l'API writer (port 3000) et la DB doivent tourner.
// Le serveur Vite est démarré automatiquement par Playwright (webServer).
//
// Sélecteurs : getByRole > getByText (doc tests-tuto).
// Pas de sleep() : on utilise await expect() qui attend intelligemment.
// =============================================================================

import { expect, test } from "@playwright/test";

test.describe("Writer — parcours utilisateur", () => {
	test("la page d'accueil affiche la liste des articles", async ({ page }) => {
		// ACT
		await page.goto("/articles");

		// ASSERT — le titre de la page est visible
		await expect(
			page.getByRole("heading", { name: "Gestion des articles" }),
		).toBeVisible();

		// ASSERT — au moins un article est affiché
		const articles = page.locator("article");
		await expect(articles.first()).toBeVisible();
	});

	test("le lien 'Nouvel article' mène au formulaire de création", async ({
		page,
	}) => {
		// ARRANGE
		await page.goto("/articles");

		// ACT
		await page.getByRole("link", { name: /nouvel article/i }).click();

		// ASSERT — le formulaire de création est affiché
		await expect(
			page.getByRole("heading", { name: "Nouvel article" }),
		).toBeVisible();

		// ASSERT — les champs du formulaire sont présents
		await expect(
			page.getByRole("textbox", { name: "Titre *", exact: true }),
		).toBeVisible();
		await expect(page.getByLabel(/catégorie/i)).toBeVisible();
	});
});
