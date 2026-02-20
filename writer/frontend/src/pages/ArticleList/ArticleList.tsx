import { useEffect, useState } from "react";
import type { ArticleType } from "../../components/ArticleList/ArticleCard";
import ArticleCard from "../../components/ArticleList/ArticleCard";
import SearchBar from "../../components/ArticleList/SearchBar";
import StatusToggle from "../../components/ArticleList/StatusToggle";
import Pagination from "../../components/Pagination/Pagination";
import {
	fetchArticles,
	type PaginationInfo,
} from "../../services/articleListService";
import { searchArticles } from "../../services/searchBarService";
import "./ArticleList.css";
import EditButton from "../../components/ArticleList/Button";

export default function ArticleList() {
	const [articles, setArticles] = useState<ArticleType[]>([]);
	const [query, setQuery] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(5);
	const [pagination, setPagination] = useState<PaginationInfo | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		fetchArticles(page, limit, controller.signal)
			.then((data) => {
				setArticles(data.articles);
				setPagination(data.pagination);
			})
			.catch((err) => {
				if (err instanceof Error && err.name === "AbortError") return;
				setError(err instanceof Error ? err.message : "Erreur inconnue");
			})
			.finally(() => setLoading(false));
		return () => controller.abort();
	}, [page, limit]);

	const handleSearch = () => {
		setLoading(true);

		if (query.trim()) {
			searchArticles(query)
				.then((data) => {
					setArticles(data);
					setPagination(null);
				})
				.catch((err) => setError(err.message))
				.finally(() => setLoading(false));
		} else {
			setPage(1);
			fetchArticles(1, limit)
				.then((data) => {
					setArticles(data.articles);
					setPagination(data.pagination);
				})
				.catch((err) => setError(err.message))
				.finally(() => setLoading(false));
		}
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
		setPage(1);
	};

	const handleStatusChange = (id: number, isActive: boolean) => {
		setArticles(
			articles.map((article) =>
				article.id === id
					? {
							...article,
							deletedAt: isActive ? null : new Date().toISOString(),
						}
					: article,
			),
		);
	};

	return (
		<section className="article-list-page" aria-labelledby="page-title">
			<header className="page-header">
				<h1 id="page-title">Gestion des articles</h1>
				<p className="page-subtitle">
					Recherchez, modifiez et gérez le statut de vos articles
				</p>
			</header>

			<search className="toolbar">
				<SearchBar
					query={query}
					onQueryChange={setQuery}
					onSearch={handleSearch}
				/>
				{pagination && (
					<output className="toolbar-stats">
						{pagination.total} article{pagination.total > 1 ? "s" : ""} au total
					</output>
				)}
			</search>

			{loading ? (
				<figure className="loading-state" aria-busy="true">
					<span className="loading-spinner" aria-hidden="true" />
					<figcaption>Chargement des articles...</figcaption>
				</figure>
			) : error ? (
				<aside className="error-state" role="alert">
					<p>Erreur : {error}</p>
				</aside>
			) : articles.length === 0 ? (
				<figure className="empty-state">
					<figcaption>Aucun article trouvé</figcaption>
				</figure>
			) : (
				<ul className="articles-container">
					{articles.map((article) => (
						<li
							key={article.id}
							className={`article-row ${article.deletedAt ? "article-row--inactive" : ""}`}
						>
							<ArticleCard article={article} />
							<menu className="article-actions">
								<li>
									<EditButton articleId={article.id} />
								</li>
								<li>
									<StatusToggle
										articleId={article.id}
										isActive={!article.deletedAt}
										onStatusChange={handleStatusChange}
									/>
								</li>
							</menu>
						</li>
					))}
				</ul>
			)}

			{pagination && !loading && articles.length > 0 && (
				<Pagination
					pagination={pagination}
					onPageChange={handlePageChange}
					onLimitChange={handleLimitChange}
				/>
			)}
		</section>
	);
}
