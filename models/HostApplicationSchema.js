import mongoose from "mongoose";

const HostApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expertise: {
      type: [String],
      enum: ["Debate", "GD", "ExpertTalk"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
    reasonIfDenied: {
      type: String,
    },

    // Host Application Form
    applicationForm: {
      type: [{
        question: { type: String, required: true },
        answer: { type: String, required: true },
      }],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HostApplication", HostApplicationSchema);
