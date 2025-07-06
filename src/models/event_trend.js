// TrendEvent.js
import mongoose from "mongoose";

const trendEventSchema = new mongoose.Schema(
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

const TrendEvent =
  mongoose.models.TrendEvent || mongoose.model("TrendEvent", trendEventSchema);
export default TrendEvent;
