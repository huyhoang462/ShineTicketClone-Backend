import mongoose from "mongoose";

// Tạo schema cho TicketStatus
const ticketStatusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
      required: true, // Trường này không được để trống
      maxlength: 100, // Giới hạn độ dài tối đa
    },
  },
  {
    versionKey: false, // Bỏ qua trường __v do Mongoose tự động thêm vào
    timestamps: false, // Không tạo các cột createdAt và updatedAt
  }
);

// Tạo model từ schema
const TicketStatus =
  mongoose.models.TicketStatus ||
  mongoose.model("TicketStatus", ticketStatusSchema);

export default TicketStatus;
