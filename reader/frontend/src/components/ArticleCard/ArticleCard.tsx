import type { Article } from "../../types/article.types";
import { formatDate } from "../../utils/format-date";
import "./ArticleCard.css";

interface ArticleCardProps {
	article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
	return (
		<article className="article-card">
			<span className="article-card__date">
				Date de publication : {formatDate(article.publish_date)}
			</span>
			<h2 className="article-card__title">{article.title}</h2>
			<p className="article-card__chapeau">{article.subhead}</p>
		</article>
	);
}

export default ArticleCard;
