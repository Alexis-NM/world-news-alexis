// =============================================================================
// Tests E2E — Reader Frontend
// =============================================================================
//
// Scénarios utilisateur réels testés avec Playwright (navigateur headless).
// On vérifie les parcours critiques : consultation de la liste d'articles
// et navigation vers le détail d'un article.
//
// Pré-requis : l'API reader (port 3001) et la DB doivent tourner.
// Le serveur Vite est démarré automatiquement par Playwright (webServer).
//
// Sélecteurs : getByRole > getByText (doc tests-tuto).
// Pas de sleep() : on utilise await expect() qui attend intelligemment.
// =============================================================================

import { expect, test } from "@playwright/test";

test.describe("Reader — parcours utilisateur", () => {
	test("la page d'accueil affiche une liste d'articles", async ({ page }) => {
		// ACT
		await page.goto("/");

		// ASSERT — au moins un article visible avec un titre (heading h2)
		const articles = page.locator("article");
		await expect(articles.first()).toBeVisible();
		await expect(articles.first().getByRole("heading")).toBeVisible();
	});

	test("cliquer sur un article affiche son contenu complet", async ({
		page,
	}) => {
		// ARRANGE
		await page.goto("/");
		const firstArticleTitle = await page
			.locator("article")
			.first()
			.getByRole("heading")
			.textContent();

		// ACT — clic sur le premier article
		await page.locator("article").first().click();

		// ASSERT — le titre est affiché sur la page de détail
		await expect(
			page.getByRole("heading", { name: firstArticleTitle! }),
		).toBeVisible();

		// ASSERT — le lien de retour est présent
		await expect(
			page.getByRole("link", { name: /retour aux articles/i }),
		).toBeVisible();
	});
});
