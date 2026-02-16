import "reflect-metadata";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import routes from "./routes/index.js";
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { logger } from './config/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ou FRONT_URL selon ce que tu as dans ton .env
    credentials: true,
  })
);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
}));

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
