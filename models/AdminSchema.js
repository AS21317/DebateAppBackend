import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    host: {
      type: mongoose.Types.ObjectId,
      ref: "Host",
      default: null
    },
    role: {
      type: String,
      enum: ["admin", "coAdmin"],
      default: "admin",
    },

    events: [{
      type: mongoose.Types.ObjectId,
      ref: "Event"
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
