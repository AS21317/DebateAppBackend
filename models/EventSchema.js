import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    attendees: [{
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },

      // status of the user for this event
      status: {
        type: String,
        enum: ["allowed", "removed"],
        default: "allowed",
      },
      reasonIfRemoved: { type: String },

      // if the user was present in the event or not
      wasPresent: {
        type: Boolean,
        default: false,
      },
      
      // user review and rating, to be given by the host
      review: {
        type: String,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    }],

    topic: {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
      required: true 
    },
    description: { type: String, required: true },
    photo: { type: String, required: true },

    type: {
      type: String,
      enum: ["debate", "groupDiscussion", "expertTalk"],
      required: true
    },
    language: {
      type: String,
      enum: ["Hinglish", "English", "Hindi"],
      default: "Hinglish",
    },

    // status of the event
    // pending means it needs approval by the host yet
    // upcoming means the event has been approved by the host and is in upcoming days/time
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "upcoming"],
      default: "pending",
    },
    reasonIfCancelled: { type: String },

    maxAttendees: { type: Number, required: true },
    
    startDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endDate: { type: String, required: true },
    endTime: { type: String, required: true },

    meetLink: { type: String },
    // eventLink: { type: String },
    // calendarEventId: { type: String },

    // event reviews by the users and the host
    eventReviews: { type: [String] },
    
    // host reviews by the users
    hostReviews: { type: [String] },
  },
  { timestamps: true }
);

// eventSchema.pre(/^find/, (next) => {
//   this.populate("user").populate({
//     path: "host",
//     select: "name", 
//   })
//   next(); 
// })

export default mongoose.model("Event", EventSchema);
