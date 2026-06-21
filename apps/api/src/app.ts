import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import { businessesRouter } from "./routes/businesses.js";
import { healthRouter } from "./routes/health.js";
import { inquiriesRouter } from "./routes/inquiries.js";
import { noticesRouter } from "./routes/notices.js";

function getAllowedOrigins(): string[] {
  const configured = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
  return configured
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`허용되지 않은 Origin입니다: ${origin}`));
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"]
    })
  );
  app.use(express.json({ limit: "100kb" }));

  app.get("/", (_req, res) => {
    res.json({
      name: "미래스마트산업진흥원 MVP API",
      health: "/api/health"
    });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/businesses", businessesRouter);
  app.use("/api/notices", noticesRouter);
  app.use("/api/inquiries", inquiriesRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: "요청한 API 경로를 찾을 수 없습니다." });
  });

  const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: "서버 처리 중 오류가 발생했습니다." });
  };

  app.use(errorHandler);
  return app;
}
