import mongoose from "mongoose";

// Tạo schema cho Orders
const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với collection Users
      required: true,
    },
    order_date: {
      type: Date,
      default: Date.now, // Mặc định là ngày hiện tại
    },
    total_amount: {
      type: mongoose.Decimal128,
      required: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Liên kết với collection Event
      required: true,
    },
    event_name: {
      type: String,
      required: true,
    },
    event_date: {
      type: Date,
    },
    event_address: {
      type: String,
    },

    order_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderStatus", // Liên kết với collection OrderStatus
      required: true,
    },
  },
  {
    versionKey: false, // Bỏ qua trường __v của Mongoose
    timestamps: false, // Không tạo các trường createdAt và updatedAt
  }
);

// Tạo model từ schema
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
