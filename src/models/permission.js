import mongoose from "mongoose";

// Định nghĩa Schema cho Permission
const permissionSchema = new mongoose.Schema(
  {
    permission_name: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role", // Tham chiếu đến model Role
      },
    ],
  },
  {
    versionKey: false, // Loại bỏ __v
    timestamps: false, // Bỏ qua createdAt và updatedAt
  }
);

// Tạo model từ schema
const Permission =
  mongoose.models.Permission || mongoose.model("Permission", permissionSchema);

export default Permission;
