import { Router } from "express";
import { isDatabaseConnected } from "../services/database.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "fsipi-api",
    database: isDatabaseConnected() ? "mongodb" : "memory",
    timestamp: new Date().toISOString()
  });
});
