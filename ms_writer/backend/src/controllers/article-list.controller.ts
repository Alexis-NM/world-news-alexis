import type { Request, Response } from "express";
import { AppDataSource } from "../config/database.js";
import { Article } from "../models/article.model.js";

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const parsedLimit = parseInt(req.query.limit as string);
    const limit = [5, 10].includes(parsedLimit) ? parsedLimit : 5;
    const skip = (page - 1) * limit;

    const repository = AppDataSource.getRepository(Article);

    const [articles, total] = await repository
      .createQueryBuilder("article")
      .select([
        "article.id",
        "article.title",
        "article.subtitle",
        "article.subhead",
        "article.publish_date",
        "article.update_date",
        "article.deletedAt",
      ])
      .leftJoinAndSelect("article.category", "category")
      .withDeleted()
      .addSelect("COALESCE(article.update_date, article.publish_date)", "sort_date")
      .orderBy("sort_date", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.status(200).json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des articles.",
    });
  }
};
