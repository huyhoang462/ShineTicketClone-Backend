import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: null,
    },
    event_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      default: null,
    },
    event_format: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      default: null,
    },
    venue_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      default: null,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    event_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventStatus",
      default: "676ece5d50c4e95732edbadd", // ID mặc định cho "Chờ xử lý"
    },
    total_tickets: {
      type: Number,
      required: true,
    },
    available_tickets: {
      type: Number,
      required: true,
    },
    logo_url: {
      type: String,
      maxlength: 255,
      default: null,
    },
    cover_image_url: {
      type: String,
      maxlength: 255,
      default: null,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false, // Loại bỏ __v
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

// Tạo model từ schema
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
