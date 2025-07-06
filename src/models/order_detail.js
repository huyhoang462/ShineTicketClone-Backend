import mongoose from "mongoose";

// Tạo schema cho OrderDetails
const orderDetailsSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Liên kết với collection Orders
      required: true,
    },
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket", // Liên kết với collection Tickets
      required: true,
    },
    ticket_type: {
      type: String,
    },
    ticket_date: {
      type: Date,
    },
    price: {
      type: mongoose.Decimal128,
      required: true, // Giá trị phải có
    },
  },
  {
    versionKey: false, // Bỏ qua trường __v của Mongoose
    timestamps: false, // Không tạo các trường createdAt và updatedAt
  }
);

// Tạo model từ schema
const OrderDetail =
  mongoose.models.OrderDetail ||
  mongoose.model("OrderDetail", orderDetailsSchema);

export default OrderDetail;
