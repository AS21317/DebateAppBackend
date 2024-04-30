
// import Review from '../models/reviewSchema.js'
// import Doctor from '../models/hostSchema.js'

// // get all review  

// export const getAllReview = async(req,res)=>{

//     try{
//         const reviews = await Review.find({})
//         res.status(200).send({
//             success:true,
//             message:"Found all the Reviews",
//             data:reviews
//         })

//     } catch(err)
//     {
//         console.log("Error while review fetching ",err);
//         res.status(500).send({
//             success:false,
//             message:"No review Found",
//         })

//     }

// }


// export const createReview = async(req,res)=>{

//     //*  *** we have derived userId from token , and not using userId comming from params ***

//     // console.log("params is ; ",req.params);

//     if(!req.body.doctor)
//     {
//         req.body.doctor = req.params.id
//     }

//     if(!req.body.user)
//     {
//         req.body.user = req.userId
//     }
//     // console.log("Req body see ",req.body);

//     const newReview = new Review(req.body)

//     try {
//         const savedReview = await  newReview.save()
//         // console.log("Saved review is : ",savedReview);
//         // after saving this review , update the corresponding doctor reviews in doctor collection

//         await Doctor.findByIdAndUpdate(req.body.doctor,{$push:{reviews:savedReview._id}})  //* created a relationship between doctor and reviews
//         res.status(200).send({
//             success:true,
//             message:"Review added Successfully !",
//             data:savedReview
//         })
//     } catch (error) {
//         console.log("Error during review saving ",err);
//         res.status(500).send({ 
//             success:false,
//             message:err.message,
         
//         })
//     }
// }