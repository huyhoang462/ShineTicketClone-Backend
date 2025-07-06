import mongoose from "mongoose";

const eventStatusSchema = new mongoose.Schema(
  {
    status_name: {
      type: String,
      required: true,
      maxlength: 100,
    },
  },
  {
    versionKey: false, // Loại bỏ __v
    timestamps: false, // Không tạo các cột thời gian mặc định
  }
);

// Tạo model từ schema
const EventStatus =
  mongoose.models.EventStatus ||
  mongoose.model("EventStatus", eventStatusSchema);

export default EventStatus;
