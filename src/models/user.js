import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const { isEmail } = validator; // Lấy ra hàm isEmail
// Định nghĩa schema cho model Users
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true, // Tương tự như Sequelize
      validate: [isEmail, "Vui lòng nhập email đúng định dạng"],
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập password"],
      minlength: [8, "Mật khẩu có ít nhất 8 ký tự"],
    },
    phone_number: {
      type: String,
      default: null,
    },
    date_of_birth: {
      type: Date,
      default: null,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false, // MongoDB sẽ không tự động thêm timestamp (createdAt, updatedAt)
    versionKey: false, // Tắt _v field (có thể bỏ nếu muốn sử dụng)
  }
);

//check role id
// userSchema.pre("save", async function (next) {
//   const roleExists = await mongoose
//     .model("Role")
//     .findOne({ role_id: this.role_id });
//   if (!roleExists) {
//     return next(new Error(`Role with role_id ${this.role_id} does not exist.`));
//   }
//   next();
// });

// hashpass
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//Tạo model từ schema
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
