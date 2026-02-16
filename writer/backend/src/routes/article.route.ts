import { Router } from "express";
import { articleController } from "../controllers/article.controller.js";
import { getAllArticles } from "../controllers/article-list.controller.js";
import { searchArticles } from "../controllers/article-search.controller.js";
import { validateId } from "../middlewares/validate-id.middleware.js";

const router = Router();

// Récupérer tous les articles
router.get("/", getAllArticles);

// Créer un article
router.post("/", (req, res) =>
  articleController.createArticle(req, res)
);

// Rechercher des articles
router.get("/search", searchArticles);

// Récupérer un article par ID
router.get("/:id", validateId, (req, res) =>
  articleController.getArticle(req, res)
);

// Mettre à jour un article
router.patch("/:id", validateId, (req, res) =>
  articleController.updateArticle(req, res)
);

// Supprimer un article
router.patch("/:id/delete", validateId, (req, res) =>
  articleController.softDeleteArticle(req, res)
);

// Restorer un article
router.patch("/:id/restore", validateId, (req, res) =>
  articleController.restoreArticle(req, res)
);

export default router;
