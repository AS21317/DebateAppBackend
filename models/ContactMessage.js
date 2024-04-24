import mongoose from "mongoose";

// Define a schema for messages
const messageSchema = new mongoose.Schema({
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model from the schema 

export default mongoose.model("Message", messageSchema);