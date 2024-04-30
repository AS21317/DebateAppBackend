// import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema(
//   {
//     from: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       refPath: 'fromType' // Reference path to dynamically determine the model
//     },
//     fromType: {
//       type: String,
//       required: true,
//       enum: ['Host', 'User'] // Possible values for the 'from' reference
//     },

//     to: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       refPath: 'toType' // Reference path to dynamically determine the model
//     },
//     toType: {
//       type: String,
//       required: true,
//       enum: ['Host', 'User'] // Possible values for the 'to' reference
//     },

//     event: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Event",
//     },

    
//   },
//   { timestamps: true }
// );

// // Populate the user info who created the review
// // here we are using pre middleware for this tassk
// // now in the review document we can fetch user info

// reviewSchema.pre(/^find/, function (next) {
//   this
//     .populate({
//       path: "user",
//       select: "name",
//     })
//     .populate({
//       path: "host",
//       select: "name",
//     });
//   next();
// });

// // now we will calculate avarage rating by mongo methods
// reviewSchema.statics.calculateAvgRating = async function (id, type) {
//   //* THis points the current review
//   const stats = await this.aggregate([
//     {
//       $match: { type: id },
//     },
//     {
//       $group: {
//         _id: `$${type}`,
//         numOfRating: { $sum: 1 },
//         avrRating: { $avg: "$rating" },
//       },
//     },
//   ]);

//   // console.log(stats);  // esme hme host ki id , usa\ki average rating and number of rating mil rhi hai

//   // now update the doctoe schema with this calculated info
//   if(type == "Host"){
//     await Host.findByIdAndUpdate(id, {
//       totalRating: stats[0].numOfRating,
//       averageRating: stats[0].avrRating,
//     });
//   }else{
//     await User.findByIdAndUpdate(id, {
//       totalRating: stats[0].numOfRating,
//       averageRating: stats[0].avrRating,
//     })
//   }
// };

// // using postmiddleware , which will automatically execute just after saving a review document
// reviewSchema.post("save", function () {
//   this.constructor.calculateAvgRating(this.to, this.toType);
// });

// export default mongoose.model("Review", reviewSchema);
