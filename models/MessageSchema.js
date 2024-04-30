import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
      },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    visitor: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);