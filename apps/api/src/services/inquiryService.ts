import { randomUUID } from "node:crypto";
import { InquiryModel } from "../models/Inquiry.js";
import { isDatabaseConnected } from "./database.js";

export interface InquiryInput {
  inquiryType: string;
  organization: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyAgreed: boolean;
}

interface SavedInquiry extends InquiryInput {
  receiptNumber: string;
  status: "received";
  createdAt: string;
}

const memoryStore: SavedInquiry[] = [];

function createReceiptNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().slice(0, 8).toUpperCase();
  return `FSIPI-${date}-${suffix}`;
}

export async function saveInquiry(input: InquiryInput): Promise<{
  receiptNumber: string;
  storage: "mongodb" | "memory";
}> {
  const receiptNumber = createReceiptNumber();

  if (isDatabaseConnected()) {
    await InquiryModel.create({
      ...input,
      receiptNumber,
      status: "received"
    });

    return { receiptNumber, storage: "mongodb" };
  }

  memoryStore.push({
    ...input,
    receiptNumber,
    status: "received",
    createdAt: new Date().toISOString()
  });

  console.info(`[inquiry] 메모리 접수 ${receiptNumber}`);
  return { receiptNumber, storage: "memory" };
}
