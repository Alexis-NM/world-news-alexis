import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import articlesRoutes from "./routes/article.route.js";

const app = express();

app.use(helmet());

app.use(
	cors({
		origin: process.env["FRONTEND_URL"],
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

export default app;
