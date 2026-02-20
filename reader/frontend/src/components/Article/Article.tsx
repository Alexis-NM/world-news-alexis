import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { articleService } from "../../services/article.service";
import type { Article as ArticleType } from "../../types/article.types";
import { formatDate } from "../../utils/format-date";
import "./Article.css";

export default function Article() {
	const { id } = useParams<{ id: string }>();
	const [article, setArticle] = useState<ArticleType | null>(null);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		const controller = new AbortController();

		const fetchArticle = async () => {
			try {
				const data = await articleService.getArticleById(
					Number(id),
					controller.signal,
				);
				if (!data) {
					setNotFound(true);
				} else {
					setArticle(data);
				}
			} catch (err) {
				if (err instanceof Error && err.name === "AbortError") return;
				setNotFound(true);
			}
		};

		fetchArticle();
		return () => controller.abort();
	}, [id]);

	if (notFound) {
		return (
			<div className="article">
				<p>Article inexistant, veuillez retourner à la liste d'articles.</p>
				<Link to="/">← Retour aux articles</Link>
			</div>
		);
	}

	if (!article) {
		return (
			<p aria-live="polite" aria-busy="true">
				Chargement...
			</p>
		);
	}

	return (
		<article className="article">
			<Link to="/" className="article__back">
				← Retour aux articles
			</Link>

			<header className="article__header">
				<span className="article__date">
					Publié le {formatDate(article.publish_date)}
				</span>
				<h1 className="article__title">{article.title}</h1>
				<h2 className="article__subtitle">{article.subtitle}</h2>
			</header>

			<p className="article__subhead">{article.subhead}</p>

			<p className="article__body">{article.body}</p>
		</article>
	);
}
