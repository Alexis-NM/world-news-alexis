// =============================================================================
// Tests de composant — Header
// =============================================================================
//
// Le Header affiche le logo World News. On vérifie que l'image est
// présente avec son attribut alt (accessibilité).
// Sélecteur getByRole("img") : le plus robuste selon la doc tests-tuto.
// =============================================================================

import { render, screen } from "@testing-library/react";
import Header from "../components/Header/Header";

describe("Header", () => {
	it("affiche le logo avec un alt text accessible", () => {
		// ARRANGE
		render(<Header />);

		// ASSERT
		expect(
			screen.getByRole("img", { name: "World News Logo" }),
		).toBeInTheDocument();
	});
});
