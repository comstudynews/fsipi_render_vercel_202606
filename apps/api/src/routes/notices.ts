import { Router } from "express";
import { notices } from "../data/notices.js";

export const noticesRouter = Router();

noticesRouter.get("/", (_req, res) => {
  res.json({ items: notices, total: notices.length });
});

noticesRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const notice = notices.find((item) => item.id === id);

  if (!notice) {
    return res.status(404).json({ message: "공지사항을 찾을 수 없습니다." });
  }

  return res.json(notice);
});
