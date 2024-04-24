import mongoose from "mongoose";
import Doctor from "../models/DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Populate the user info who created the review
// here we are using pre middleware for this tassk
// now in the review document we can fetch user info

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// now we will calculate avarage rating by mongo methods
reviewSchema.statics.calculateAvgRating = async function (doctorId) {
  //* THis points the current review
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avrRating: { $avg: "$rating" },
      },
    },
  ]);

  // console.log(stats);  // esme hme doctor ki id , usaki average rating and number of rating mil rhi hai

  // now update the doctoe schema with this calculated info
  await Doctor.findByIdAndUpdate(doctorId, {
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].averRating,
  });
};

// using postmiddleware , which will automatically execute just after saving a review document
reviewSchema.post("save", function () {
  this.constructor.calculateAvgRating(this.doctor);
});

export default mongoose.model("Review", reviewSchema);
