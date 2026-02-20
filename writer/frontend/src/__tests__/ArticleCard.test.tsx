// =============================================================================
// Tests de composant — ArticleCard (Writer)
// =============================================================================
//
// ArticleCard affiche un article avec son titre, sa catégorie (optionnelle),
// son sous-titre (optionnel) et ses dates. On teste le rendu conditionnel :
// certains champs ne s'affichent que si la donnée est présente.
//
// Sélecteurs : getByRole > getByText (doc tests-tuto).
// =============================================================================

import { render, screen } from "@testing-library/react";
import ArticleCard from "../components/ArticleList/ArticleCard";

const baseArticle = {
	id: 1,
	title: "Titre de test",
	subtitle: "Sous-titre de test",
	subhead: "Chapeau de test",
	publish_date: "2025-06-15T10:00:00.000Z",
	update_date: null,
	deletedAt: null,
	category: { id: 1, title: "Technologie" },
};

describe("ArticleCard", () => {
	it("affiche le titre de l'article", () => {
		// ARRANGE
		render(<ArticleCard article={baseArticle} />);

		// ASSERT
		expect(
			screen.getByRole("heading", { name: "Titre de test" }),
		).toBeInTheDocument();
	});

	it("affiche la catégorie quand elle est présente", () => {
		// ARRANGE
		render(<ArticleCard article={baseArticle} />);

		// ASSERT
		expect(screen.getByText("Technologie")).toBeInTheDocument();
	});

	it("affiche la date de modification quand elle existe", () => {
		// ARRANGE
		const articleModifie = {
			...baseArticle,
			update_date: "2025-07-01T14:00:00.000Z",
		};
		render(<ArticleCard article={articleModifie} />);

		// ASSERT
		expect(screen.getByText(/Modifié le/)).toBeInTheDocument();
	});
});
