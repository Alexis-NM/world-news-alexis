import { Router } from "express";
import { geminiController } from "../controllers/gemini.controller.js";

const router = Router();

router.post("/generate-titre", (req, res) =>
	geminiController.generateTitle(req, res),
);

router.post("/generate-sous-titre", (req, res) =>
	geminiController.generateSubtitle(req, res),
);

router.post("/generate-chapeau", (req, res) =>
	geminiController.generateSubhead(req, res),
);

router.post("/generate-body", (req, res) =>
	geminiController.generateBody(req, res),
);

export default router;
