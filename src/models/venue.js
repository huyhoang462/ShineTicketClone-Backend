import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    venue_name: {
      type: String,
      maxlength: 255,
      default: null,
    },
    street_name: {
      type: String,
      maxlength: 255,
      default: null,
    },
    ward: {
      type: String,
      maxlength: 100,
      default: null,
    },
    district: {
      type: String,
      maxlength: 100,
      default: null,
    },
    city: {
      type: String,
      maxlength: 100,
      default: null,
    },
  },
  {
    versionKey: false, // Loại bỏ __v
    timestamps: false, // Không tạo các cột thời gian mặc định
  }
);

// Tạo model từ schema
const Venue = mongoose.models.Venue || mongoose.model("Venue", venueSchema);

export default Venue;
