import mongoose from "mongoose";

const HostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    },
    expertise: { 
      type: [String], 
      enum: ["Debate", "GD", "ExperTalk"],
      required: true 
    },
    
    timeSlots: [{ type: String }],

    events: [{
      type: mongoose.Types.ObjectId,
      ref: "Event",
    }],

    averageRating: {
      type: Number,
      default: 0,
      max: 5,
    },
    totalRating: {
      type: Number,
      default: 0,
    },

    // OAuth token for creating an event at backennd
    // not to be shared with frontend
    gToken: { type: String },

    // Approved Host Application // no need I guess, we can get it from the userId from HostApplicationSchema
    // hostApplication: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "HostApplication",
    //   required: true,
    // }
  },
  { timestamps: true }
);

export default mongoose.model("Host", HostSchema);
