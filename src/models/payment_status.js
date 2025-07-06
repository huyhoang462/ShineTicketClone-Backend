import { MongoGCPError } from "mongodb";
import mongoose from "mongoose";

// Tạo schema cho PaymentStatus
const paymentStatusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
      required: true, // Trường này không được để trống
      maxlength: 100, // Giới hạn độ dài tối đa
    },
  },
  {
    versionKey: false, // Bỏ qua trường __v của Mongoose
    timestamps: false, // Không tạo các trường createdAt và updatedAt
  }
);

// Tạo model từ schema
const PaymentStatus =
  mongoose.models.PaymentStatus ||
  mongoose.model("PaymentStatus", paymentStatusSchema);

export default PaymentStatus;
