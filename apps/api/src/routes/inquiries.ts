import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { saveInquiry } from "../services/inquiryService.js";

export const inquiriesRouter = Router();

const inquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "문의 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }
});

const inquirySchema = z.object({
  inquiryType: z.enum(["교육", "기업지원", "공공사업", "산학연", "기타"]),
  organization: z.string().trim().max(100).default(""),
  name: z.string().trim().min(2, "이름을 입력해 주세요.").max(50),
  email: z.email("올바른 이메일 주소를 입력해 주세요."),
  phone: z.string().trim().max(30).default(""),
  message: z.string().trim().min(10, "문의 내용은 10자 이상 입력해 주세요.").max(2000),
  privacyAgreed: z.literal(true, {
    error: "개인정보 수집·이용에 동의해야 합니다."
  })
});

inquiriesRouter.post("/", inquiryLimiter, async (req, res, next) => {
  try {
    const parsed = inquirySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "입력값을 확인해 주세요.",
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const result = await saveInquiry(parsed.data);

    return res.status(201).json({
      message: "문의가 접수되었습니다.",
      receiptNumber: result.receiptNumber,
      storage: result.storage
    });
  } catch (error) {
    return next(error);
  }
});
