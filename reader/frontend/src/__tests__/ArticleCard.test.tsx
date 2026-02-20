// =============================================================================
// Tests de composant — ArticleCard
// =============================================================================
//
// ArticleCard est un composant pur qui reçoit un article en props et affiche
// le titre, le chapeau et la date de publication formatée.
//
// On teste le COMPORTEMENT observable : ce que l'utilisateur voit à l'écran.
// On utilise les sélecteurs Testing Library par ordre de priorité :
// getByRole > getByText (comme recommandé par la doc tests-tuto).
// =============================================================================

import { render, screen } from "@testing-library/react";
import ArticleCard from "../components/ArticleCard/ArticleCard";

const article = {
	id: 1,
	title: "Titre de test",
	subtitle: "Sous-titre de test",
	subhead: "Chapeau de test",
	body: "Corps de test",
	publish_date: "2025-06-15T10:00:00.000Z",
};

describe("ArticleCard", () => {
	it("affiche le titre de l'article", () => {
		// ARRANGE
		render(<ArticleCard article={article} />);

		// ASSERT
		expect(
			screen.getByRole("heading", { name: "Titre de test" }),
		).toBeInTheDocument();
	});

	it("affiche le chapeau de l'article", () => {
		// ARRANGE
		render(<ArticleCard article={article} />);

		// ASSERT
		expect(screen.getByText("Chapeau de test")).toBeInTheDocument();
	});

	it("affiche la date de publication formatée en français", () => {
		// ARRANGE
		render(<ArticleCard article={article} />);

		// ASSERT
		expect(screen.getByText(/15 juin 2025/)).toBeInTheDocument();
	});
});
