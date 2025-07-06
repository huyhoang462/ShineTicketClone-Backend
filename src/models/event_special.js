// SpecialEvent.js
import mongoose from "mongoose";

const specialEventSchema = new mongoose.Schema(
  {
    Event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const SpecialEvent =
  mongoose.models.SpecialEvent ||
  mongoose.model("SpecialEvent", specialEventSchema);
export default SpecialEvent;
