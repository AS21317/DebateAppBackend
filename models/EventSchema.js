import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Types.ObjectId,
      ref: "Host",
      required: true,
    },
    coHost: {
      type: mongoose.Types.ObjectId,
      ref: "Host",
    },
    expert: {
      type: mongoose.Types.ObjectId,
      ref: 'Expert',
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
      enum: ["Debate", "GD", "ExpertTalk"],
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
      enum: ["requestedByAdmin", "requestedByHost", "requestedByExpert", "upcoming", "completed", "cancelled"],
      default: "requestedByAdmin",
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
    eventReviews: { 
      type: [{
        fromUser: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        review: { type: String },
        rating: { type: Number, min: 0, max: 5 },
      }],
    },
    
    // host reviews by the users
    hostReviews: { 
      type: [{
        fromUser: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        toHost: {
          type: mongoose.Types.ObjectId,
          ref: "Host",
        },
        review: { type: String },
        rating: { type: Number, min: 0, max: 5 },
      }], 
    },

    // user revies by the users
    userReviews: { 
      type: [{
        fromUser: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        toUser: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        review: { type: String },
        rating: { type: Number, min: 0, max: 5 },
      }],
    },

    // 0th index -> 1st winner, 1st index -> 2nd winner, 2nd index -> 3rd winner
    winners: {
      type: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
      }]
    },
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
