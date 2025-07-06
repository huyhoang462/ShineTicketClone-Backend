import mongoose from "mongoose";

// Tạo schema cho Tickets
const ticketSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Liên kết với collection Event
      required: true,
    },
    ticket_type: {
      type: String,
      required: true,
      maxlength: 50,
    },
    price: {
      type: mongoose.Decimal128,
      required: true,
    },
    ticket_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketStatus", // Liên kết với collection TicketStatus
      default: "675ea3974a84ab0379d42190", // ID mặc định cho trạng thái "Còn vé"
    },

    ticket_des: {
      type: String,
    },
    ticket_quantity: {
      type: Number,
    },
    event_datetime: {
      type: Date,
      // required: true,
    },
  },
  {
    versionKey: false, // Bỏ qua trường __v của Mongoose
    timestamps: false, // Không tạo các trường createdAt và updatedAt
  }
);

// Tạo model từ schema
const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;
