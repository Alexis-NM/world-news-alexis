import type { Request, Response } from "express";
import { logger } from "../config/logger.js";
import { categoryService } from "../services/category.service.js";

class CategoryController {
	async getCategory(req: Request, res: Response): Promise<void> {
		try {
			const categoryId = parseInt(req.params.id as string, 10);
			const category = await categoryService.getCategoryById(categoryId);

			if (!category) {
				res.status(404).json({
					error: "Catégorie non trouvée",
				});
				return;
			}

			res.status(200).json({
				data: category,
			});
		} catch (error) {
			logger.error(`Erreur lors de la récupération de la catégorie: ${error}`);

			res.status(500).json({
				error: "Erreur interne du serveur",
			});
		}
	}
}

export const categoryController = new CategoryController();
