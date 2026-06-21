import mongoose from "mongoose";

const { Schema } = mongoose;

const inquirySchema = new Schema(
  {
    receiptNumber: { type: String, required: true, unique: true, index: true },
    inquiryType: { type: String, required: true },
    organization: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    privacyAgreed: { type: Boolean, required: true },
    status: { type: String, default: "received" }
  },
  { timestamps: true }
);

export const InquiryModel =
  mongoose.models.Inquiry ?? mongoose.model("Inquiry", inquirySchema);
