import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Article } from "../../types/article.types";
import { articleService } from "../../services/article.service";
import ArticleCard from "../ArticleCard/ArticleCard";
import "./ArticleList.css";

function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchArticles = async () => {
      try {
        const data = await articleService.getAllArticles(controller.signal);
        setArticles(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de récupérer les articles"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <p className="loading" aria-live="polite" aria-busy="true">Chargement des articles...</p>;
  }

  if (error) {
    return (
      <div className="empty-state">
        <p className="empty-state__icon">😕</p>
        <p className="empty-state__message">Oups ! Une erreur est survenue</p>
        <p className="empty-state__detail">{error}</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__icon">📰</p>
        <p className="empty-state__message">Aucun article disponible pour le moment</p>
        <p className="empty-state__detail">Revenez bientôt pour découvrir nos dernières actualités !</p>
      </div>
    );
  }

  return (
    <section className="articles-grid">
      {articles.map((article) => (
        <Link key={article.id} to={`/${article.id}`} className="article-card-link">
          <ArticleCard article={article} />
        </Link>
      ))}
    </section>
  );
}

export default ArticleList;
