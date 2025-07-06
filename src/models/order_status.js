import mongoose from "mongoose";

// Tạo schema cho OrderStatus
const orderStatusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
      required: true, // Trường này không được để trống
    },
  },
  {
    versionKey: false, // Bỏ qua trường __v của Mongoose
    timestamps: false, // Không tạo các trường createdAt và updatedAt
  }
);

// Tạo model từ schema
const OrderStatus =
  mongoose.models.OrderStatus ||
  mongoose.model("OrderStatus", orderStatusSchema);

export default OrderStatus;
