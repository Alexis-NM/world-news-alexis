// =============================================================================
// Tests de composant — Footer (Writer)
// =============================================================================
//
// Le Footer affiche le nom du projet et les contributeurs.
// =============================================================================

import { render, screen } from "@testing-library/react";
import Footer from "../layout/Footer";

describe("Footer", () => {
	it("affiche le nom du projet", () => {
		// ARRANGE
		render(<Footer />);

		// ASSERT
		expect(screen.getByText("World News")).toBeInTheDocument();
	});
});
