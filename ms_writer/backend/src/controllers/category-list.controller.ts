import type { Request, Response} from "express";
import { AppDataSource } from "../config/database.js";
import { Category } from "../models/category.model.js";

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = AppDataSource.getRepository(Category);
        const allCategories = await categories.find({
            order: {
                title: "ASC"
            }
        });
        res.status(200).json(allCategories);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la récupération des catégories." });
    }
};