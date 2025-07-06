import mongoose from "mongoose";

// Tạo schema cho Payments
const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Tham chiếu đến model Order
      required: true,
      // Bạn có thể sử dụng `ref` để liên kết với model Orders
    },
    payment_method_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod", // Tham chiếu đến model PaymentMethod
      required: true,
    },
    payment_date: {
      type: Date,
      required: true,
    },
    payment_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentStatus", // Tham chiếu đến model PaymentStatus
      required: true,
    },
    amount_paid: {
      type: mongoose.Schema.Types.Decimal128, // Sử dụng Decimal128 cho số tiền chính xác
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now, // Thời gian tạo mặc định
    },
    updated_at: {
      type: Date,
      default: Date.now, // Thời gian cập nhật mặc định
    },
  },
  {
    versionKey: false, // Bỏ qua trường __v của Mongoose
    timestamps: true, // Tạo các trường createdAt và updatedAt tự động
  }
);

// Tạo model từ schema
const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
