import mongoose from "mongoose";

// Tạo schema cho PaymentMethod
const paymentMethodSchema = new mongoose.Schema(
  {
    method_name: {
      type: String,
      required: true, // Trường này không được để trống
      maxlength: 100, // Giới hạn độ dài tối đa
      unique: true,
    },
  },
  {
    versionKey: false, // Bỏ qua trường __v của Mongoose
    timestamps: false, // Không tạo các trường createdAt và updatedAt
  }
);

// Tạo model từ schema
const PaymentMethod =
  mongoose.models.PaymentMethod ||
  mongoose.model("PaymentMethod", paymentMethodSchema);

export default PaymentMethod;
