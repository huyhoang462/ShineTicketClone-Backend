import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true, // Đảm bảo `role_name` là duy nhất
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission", // Tham chiếu đến model Permission
      },
    ],
  },
  {
    versionKey: false, // Loại bỏ __v
    timestamps: false, // Không tạo các cột thời gian mặc định
  }
);

// Tạo model từ schema
const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;
