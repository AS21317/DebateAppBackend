import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: Number },
    photo: { 
      type: String,
      default: "http://res.cloudinary.com/dfyjwu1sh/image/upload/v1713792359/hipfc708glsely99zrck.png",
    },
    gender: { 
      type: String, 
      enum: ["male", "female", "other"], 
      required: true 
    },
    age: { type: Number, required: true },
    role: {
      type: String,
      enum: ["user", "host", "admin", "coAdmin", "expert"],
      default: "user",
    },

    AreaOfInterests: { type: Array },
    qualifications: { type: Array },
    experiences: { type: Array },

    bio: { type: String, maxLength: 50 },
    about: { type: String },

    events: [{
      type: mongoose.Types.ObjectId,
      ref: "Event"
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

    joinedWhatsApp: {
      type: Boolean,
      default: false,
    },

    appliedForHost: {
      type: Boolean,
      default: false,
    },

    socials: {
      instagram: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
      github: { type: String },
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
