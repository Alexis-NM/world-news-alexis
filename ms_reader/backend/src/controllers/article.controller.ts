import type { Request, Response, NextFunction } from "express";
import ArticlesService from "../services/article.service.js";
import { logger } from "../config/logger.js";
import { NotFoundError } from "../errors/not-found.error.js";

const articlesService = new ArticlesService();

export async function getLastTenArticlesByMostRecent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const articles = await articlesService.getLastTenByMostRecent();

    if (!articles || articles.length === 0) {
      throw new NotFoundError("Aucun article retrouvé");
    }
    res.status(200).json(articles);
  } catch (e) {
    logger.error(`Erreur lors de la récupération des articles: ${e}`);
    next(e);
  }
}

export async function getArticleById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const article = await articlesService.getById(Number(id));

    if (!article) {
      throw new NotFoundError("Article non trouvé");
    }

    res.status(200).json(article);
  } catch (e) {
    logger.error(`Erreur lors de la récupération de l'article: ${e}`);
    next(e);
  }
}
