import cors, { type CorsOptions } from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";

import { businessesRouter } from "./routes/businesses.js";
import { healthRouter } from "./routes/health.js";
import { inquiriesRouter } from "./routes/inquiries.js";
import { noticesRouter } from "./routes/notices.js";

/**
 * 허용할 프론트엔드 Origin 목록을 반환합니다.
 *
 * CLIENT_ORIGIN에는 쉼표로 구분하여 여러 주소를 등록할 수 있습니다.
 *
 * 예:
 * CLIENT_ORIGIN=https://fsipi.vercel.app,http://localhost:5173
 */
function getAllowedOrigins(): string[] {
  const configuredOrigins = (process.env.CLIENT_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

  const developmentOrigins =
    process.env.NODE_ENV === "production"
      ? []
      : ["http://localhost:5173", "http://127.0.0.1:5173"];

  return [...new Set([...configuredOrigins, ...developmentOrigins])];
}

export function createApp() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin"
      }
    })
  );

  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      /*
       * Origin이 없는 요청은 허용합니다.
       * Render 상태 확인, curl, Postman, 서버 간 요청 등이 해당합니다.
       */
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS_NOT_ALLOWED:${normalizedOrigin}`)
      );
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept"
    ],

    credentials: false,

    optionsSuccessStatus: 204,

    maxAge: 86400
  };

  /*
   * cors 미들웨어가 일반 요청과 OPTIONS 사전 요청을 모두 처리합니다.
   */
  app.use(cors(corsOptions));

  app.use(
    express.json({
      limit: "100kb"
    })
  );

  app.use(
    express.urlencoded({
      extended: false,
      limit: "100kb"
    })
  );

  app.get("/", (_req, res) => {
    res.status(200).json({
      name: "미래스마트산업진흥원 MVP API",
      status: "running",
      health: "/api/health"
    });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/businesses", businessesRouter);
  app.use("/api/notices", noticesRouter);
  app.use("/api/inquiries", inquiriesRouter);

  app.use((_req, res) => {
    res.status(404).json({
      message: "요청한 API 경로를 찾을 수 없습니다."
    });
  });

  const errorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next
  ) => {
    if (
      error instanceof Error &&
      error.message.startsWith("CORS_NOT_ALLOWED:")
    ) {
      const origin = error.message.replace("CORS_NOT_ALLOWED:", "");

      console.warn(`CORS 요청 거부: ${origin}`);

      res.status(403).json({
        message: "허용되지 않은 출처에서 요청했습니다."
      });
      return;
    }

    if (
      error instanceof SyntaxError &&
      "type" in error &&
      error.type === "entity.parse.failed"
    ) {
      res.status(400).json({
        message: "요청 본문의 JSON 형식이 올바르지 않습니다."
      });
      return;
    }

    console.error("서버 오류:", error);

    res.status(500).json({
      message: "서버 처리 중 오류가 발생했습니다."
    });
  };

  app.use(errorHandler);

  return app;
}
