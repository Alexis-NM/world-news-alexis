import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import Router from "./Router.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<ErrorBoundary>
			<Router />
		</ErrorBoundary>
	</StrictMode>,
);
