import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    events: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event" 
    }],
    avgRating: {
      type: Number,
      default: 0,
      max: 10,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
  },
);

export default mongoose.model("Topic", TopicSchema);
