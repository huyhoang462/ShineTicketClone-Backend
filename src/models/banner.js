// Banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
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
const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export default Banner;
