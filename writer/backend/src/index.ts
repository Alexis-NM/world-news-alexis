import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/database.js";
import { logger } from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			logger.info(`Serveur démarré sur http://localhost:${PORT}`);
		});
	} catch (error) {
		logger.error(`Impossible de démarrer le serveur: ${error}`);
		process.exit(1);
	}
};

startServer();
