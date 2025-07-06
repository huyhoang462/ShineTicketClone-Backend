import mongoose from "mongoose";

const eventTypeSchema = new mongoose.Schema(
  {
    type_name: {
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
const EventType =
  mongoose.models.EventType || mongoose.model("EventType", eventTypeSchema);

export default EventType;
