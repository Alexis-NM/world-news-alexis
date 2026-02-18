// =============================================================================
// Configuration de l'application Express — Writer Backend
// =============================================================================
//
// POURQUOI UN FICHIER app.ts SÉPARÉ DE index.ts ?
//
// Pour pouvoir tester l'application avec Supertest, il faut avoir accès à
// l'objet Express `app` SANS démarrer le serveur HTTP (app.listen).
//
// Si app + serveur sont dans le même fichier, importer l'app dans un test
// lance automatiquement le serveur → conflit de port, effets de bord.
//
// En séparant :
//   - app.ts  → configure Express (middlewares, routes) et EXPORTE l'objet app
//   - index.ts → importe app, connecte la DB, et lance le serveur
//
// Dans les tests : on importe app.ts directement, sans passer par index.ts.
// Supertest injecte les requêtes HTTP directement dans Express, sans réseau.
//
// =============================================================================

import "reflect-metadata";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);

app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 100,
		standardHeaders: "draft-8",
		legacyHeaders: false,
	}),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Routes
app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
	res.json({
		message: "Bienvenue sur l'API wm-rajar-ms_writer",
		status: "running",
	});
});

app.get("/health", (req: Request, res: Response) => {
	res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
	res.status(404).json({ error: "Route non trouvée" });
});

app.use(errorHandler);

export default app;
