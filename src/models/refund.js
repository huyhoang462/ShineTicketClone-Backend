import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Tham chiếu đến bảng Event
      required: true,
    },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer", // Tham chiếu đến bảng Organizer
      required: true,
    },
    total_amount: {
      type: mongoose.Decimal128, // Sử dụng Decimal128 cho số tiền chính xác
      required: true,
    },
    refund_amount: {
      type: mongoose.Decimal128, // Sử dụng Decimal128 cho số tiền hoàn trả
      required: true,
    },
    commission: {
      type: mongoose.Decimal128, // Phí hoa hồng
      required: true,
    },
    refund_date: {
      type: Date, // Ngày hoàn tiền
      required: true,
    },
    // payment_method_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "PaymentMethod", // Tham chiếu đến bảng PaymentMethod
    //   required: true,
    // },
    // bank_transaction_id: {
    //   type: String, // ID giao dịch ngân hàng
    //   default: null,
    // },
    payment_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentStatus", // Tham chiếu đến bảng PaymentStatus
      required: true,
    },
    notes: {
      type: String, // Ghi chú
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const Refund = mongoose.models.Refund || mongoose.model("Refund", refundSchema);

export default Refund;
