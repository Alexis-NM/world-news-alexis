// =============================================================================
// Tests de composant — Modal
// =============================================================================
//
// La Modal est un composant contrôlé : elle s'affiche ou non selon la prop
// isOpen. On teste le comportement observable :
//   - Invisible quand isOpen=false
//   - Visible avec titre et message quand isOpen=true
//   - Le bouton "Compris" est présent et accessible
//
// Sélecteurs : getByRole (dialog, heading, button) — doc tests-tuto.
// =============================================================================

import { render, screen } from "@testing-library/react";
import Modal from "../components/Modal/Modal";

const defaultProps = {
	isOpen: true,
	onClose: vi.fn(),
	title: "Titre modal",
	message: "Message de test",
	type: "info" as const,
};

describe("Modal", () => {
	it("n'affiche rien quand isOpen est false", () => {
		// ARRANGE
		render(<Modal {...defaultProps} isOpen={false} />);

		// ASSERT
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("affiche le titre et le message quand isOpen est true", () => {
		// ARRANGE
		render(<Modal {...defaultProps} />);

		// ASSERT
		expect(
			screen.getByRole("heading", { name: "Titre modal" }),
		).toBeInTheDocument();
		expect(screen.getByText("Message de test")).toBeInTheDocument();
	});

	it("affiche le bouton de fermeture", () => {
		// ARRANGE
		render(<Modal {...defaultProps} />);

		// ASSERT
		expect(screen.getByRole("button", { name: "Compris" })).toBeInTheDocument();
	});
});
