import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("ErrorBoundary:", error, info.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<main style={{ padding: "2rem", textAlign: "center" }}>
					<h1>Une erreur est survenue</h1>
					<p>Veuillez rafraîchir la page ou réessayer plus tard.</p>
					<button
						type="button"
						onClick={() => this.setState({ hasError: false })}
					>
						Réessayer
					</button>
				</main>
			);
		}

		return this.props.children;
	}
}
