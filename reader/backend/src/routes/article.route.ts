import { Router } from "express";
import {
	getArticleById,
	getLastTenArticlesByMostRecent,
} from "../controllers/article.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { getArticleByIdSchema } from "../schemas/article.schema.js";

const router = Router();

router.get("/", getLastTenArticlesByMostRecent);
router.get("/:id", validate(getArticleByIdSchema, "params"), getArticleById);

export default router;
