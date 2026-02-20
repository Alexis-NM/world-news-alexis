import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import articlesRoutes from "./routes/article.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(helmet());

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: ["GET"],
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

app.use("/articles", articlesRoutes);

app.use((_req, res) => {
	res.status(404).json({ error: "Route non trouvée" });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
	logger.info(`Serveur démarré sur http://localhost:${PORT}`);
});

const shutdown = async () => {
	logger.info("Arrêt du serveur...");
	server.close(() => {
		logger.info("Serveur arrêté.");
		process.exit(0);
	});
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
