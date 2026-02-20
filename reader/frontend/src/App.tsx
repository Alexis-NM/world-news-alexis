import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import "./App.css";

const ArticleList = lazy(() => import("./components/ArticleList/ArticleList"));
const Article = lazy(() => import("./components/Article/Article"));

function App() {
	return (
		<ErrorBoundary>
			<BrowserRouter>
				<Header />
				<main className="main">
					<Suspense
						fallback={
							<p className="loading" aria-live="polite">
								Chargement...
							</p>
						}
					>
						<Routes>
							<Route path="/" element={<ArticleList />} />
							<Route path="/:id" element={<Article />} />
						</Routes>
					</Suspense>
				</main>
				<Footer />
			</BrowserRouter>
		</ErrorBoundary>
	);
}

export default App;
