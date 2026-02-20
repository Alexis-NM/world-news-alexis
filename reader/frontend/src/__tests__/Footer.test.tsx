// =============================================================================
// Tests de composant — Footer
// =============================================================================
//
// Le Footer affiche les crédits du projet. On vérifie que le texte
// attendu est bien rendu à l'écran.
// =============================================================================

import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer/Footer";

describe("Footer", () => {
	it("affiche les noms des contributeurs", () => {
		// ARRANGE
		render(<Footer />);

		// ASSERT
		expect(
			screen.getByText("Raphael, Aline, Jules, Alexis, Raphaël"),
		).toBeInTheDocument();
	});
});
