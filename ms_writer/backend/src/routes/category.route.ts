import { Router } from "express";
import { getAllCategories } from "../controllers/category-list.controller.js";
import { categoryController } from "../controllers/category.controller.js";
import { validateId } from "../middlewares/validate-id.middleware.js";

const router = Router();

// Récupérer toutes les catégories
router.get("/", getAllCategories);

// Récupérer une catégorie
router.get("/:id", validateId, (req, res) =>
  categoryController.getCategory(req, res)
);

export default router;