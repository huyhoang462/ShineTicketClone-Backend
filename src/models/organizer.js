import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema(
  {
    organizer_name: {
      type: String,
      required: true,
    },
    organizer_info: {
      type: String, // TEXT trong Sequelize tương đương với String không giới hạn trong MongoDB
      default: null,
    },
    organizer_email: {
      type: String,

      default: null,
    },
    organizer_phone_number: {
      type: String,

      default: null,
    },
    account_number: {
      type: String,

      default: null,
    },
    bank_name: {
      type: String,

      default: null,
    },
    owner_name: {
      type: String,

      default: null,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến model User
      default: null,
    },
  },
  {
    versionKey: false, // Loại bỏ __v
    timestamps: false, // Không tạo các cột thời gian mặc định
  }
);

// Tạo model từ schema
const Organizer =
  mongoose.models.Organizer || mongoose.model("Organizer", organizerSchema);

export default Organizer;
