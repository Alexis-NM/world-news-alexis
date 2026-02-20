import type { Request, Response } from "express";
import { logger } from "../config/logger.js";
import { AppError } from "../errors/app.error.js";
import { geminiService } from "../services/gemini.service.js";

class GeminiController {
	async generateTitle(req: Request, res: Response): Promise<void> {
		try {
			const { body } = req.body as { body: string };

			if (!body) {
				res.status(400).json({
					error: "Le champ 'body' est requis pour générer un titre",
				});
				return;
			}

			const generatedTitle = await geminiService.generateTitle(body);

			res.status(200).json({
				message: "Titre généré avec succès",
				data: generatedTitle,
			});
		} catch (error) {
			logger.error(`Erreur lors de la génération du titre: ${error}`);

			if (error instanceof AppError) {
				res.status(error.statusCode).json({
					error: error.message,
				});
				return;
			}

			res.status(500).json({
				error: "Erreur interne du serveur lors de la génération",
			});
		}
	}

	async generateSubtitle(req: Request, res: Response): Promise<void> {
		try {
			const { title, body } = req.body as { title: string; body: string };

			if (!title) {
				res.status(400).json({
					error: "Le champ 'title' est requis pour générer un sous-titre",
				});
				return;
			}

			if (!body) {
				res.status(400).json({
					error: "Le champ 'body' est requis pour générer un sous-titre",
				});
				return;
			}

			const generatedSubtitle = await geminiService.generateSubtitle(
				title,
				body,
			);

			res.status(200).json({
				message: "Sous-titre généré avec succès",
				data: generatedSubtitle,
			});
		} catch (error) {
			logger.error(`Erreur lors de la génération du sous-titre: ${error}`);

			if (error instanceof AppError) {
				res.status(error.statusCode).json({
					error: error.message,
				});
				return;
			}

			res.status(500).json({
				error: "Erreur interne du serveur lors de la génération",
			});
		}
	}

	async generateSubhead(req: Request, res: Response): Promise<void> {
		try {
			const { body } = req.body as { body: string };

			if (!body) {
				res.status(400).json({
					error: "Le champ 'body' est requis pour générer un chapeau",
				});
				return;
			}

			const generatedSubhead = await geminiService.generateSubhead(body);

			res.status(200).json({
				message: "Chapeau généré avec succès",
				data: generatedSubhead,
			});
		} catch (error) {
			logger.error(`Erreur lors de la génération du chapeau: ${error}`);

			if (error instanceof AppError) {
				res.status(error.statusCode).json({
					error: error.message,
				});
				return;
			}

			res.status(500).json({
				error: "Erreur interne du serveur lors de la génération",
			});
		}
	}

	async generateBody(req: Request, res: Response): Promise<void> {
		try {
			const { body } = req.body as { body: string };

			if (!body) {
				res.status(400).json({
					error: "Le champ 'body' est requis pour être corrigé",
				});
				return;
			}

			const generateBody = await geminiService.generateBody(body);

			res.status(200).json({
				message: "Body corrigé avec succès",
				data: generateBody,
			});
		} catch (error) {
			logger.error(`Erreur lors de la génération du body: ${error}`);

			if (error instanceof AppError) {
				res.status(error.statusCode).json({
					error: error.message,
				});
				return;
			}

			res.status(500).json({
				error: "Erreur interne du serveur lors de la génération",
			});
		}
	}
}

export const geminiController = new GeminiController();
