import dotenv from "dotenv";
import app from "./app.js";
import { logger } from "./config/logger.js";

dotenv.config();

const PORT = process.env["PORT"];

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
