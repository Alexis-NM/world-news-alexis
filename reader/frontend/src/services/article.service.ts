import { api } from "../api/api";
import type { Article } from "../types/article.types";

export const articleService = {
	getAllArticles: async (signal?: AbortSignal): Promise<Article[]> => {
		return api.get<Article[]>("/articles", undefined, { signal });
	},

	getArticleById: async (
		id: number,
		signal?: AbortSignal,
	): Promise<Article> => {
		return api.get<Article>(`/articles/${id}`, undefined, { signal });
	},
};
