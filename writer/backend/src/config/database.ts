import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Article } from "../models/article.model.js";
import { Category } from "../models/category.model.js";
import { logger } from "./logger.js";

dotenv.config();

// Validation des variables d'environnement obligatoires
const requiredEnvVars = [
	"DB_HOST",
	"DB_PORT",
	"DB_NAME",
	"DB_USER",
	"DB_PASSWORD",
];
for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`❌ Variable d'environnement manquante: ${envVar}`);
	}
}

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST as string,
	port: Number(process.env.DB_PORT),
	database: process.env.DB_NAME as string,
	username: process.env.DB_USER as string,
	password: process.env.DB_PASSWORD as string,

	// Liste de toutes vos entities
	entities: [Article, Category],

	// Synchronisation automatique des schémas (⚠️ DANGER en production)
	synchronize: false, // Toujours false, utilisez les migrations !

	// Logs des requêtes SQL générées (désactivé en production)
	logging: process.env.NODE_ENV === "development",

	// Pool de connexions
	extra: {
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	},
});

export const connectDB = async (): Promise<void> => {
	try {
		await AppDataSource.initialize();
		logger.info("TypeORM connecté à PostgreSQL avec succès");
	} catch (error) {
		logger.error(`Erreur de connexion TypeORM: ${error}`);
		process.exit(1);
	}
};

process.on("SIGINT", async () => {
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
		logger.info("TypeORM déconnecté");
	}
	process.exit(0);
});

process.on("SIGTERM", async () => {
	if (AppDataSource.isInitialized) {
		await AppDataSource.destroy();
		logger.info("TypeORM déconnecté");
	}
	process.exit(0);
});
