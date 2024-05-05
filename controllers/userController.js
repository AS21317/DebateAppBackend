import { populate } from "dotenv";
import User from "../models/UserSchema.js";
import Host from "../models/HostSchema.js";
import Expert from "../models/ExpertSchema.js";
import Admin from "../models/AdminSchema.js";


export const updateUser = async (req, res) => {
  console.log("Update User Called")
  console.log("Req: ", req.body)

  const id = req.params.id;
  console.log("id: ", id)

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ); // new true option will return updated user

    if(!updatedUser) {
      return res.status(404).send({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .send({
        success: true,
        message: "Successfully updated",
        data: updatedUser,
      });
      console.log("User Updated Successfully!")
  } catch (err) {
    console.log("Error while updating user: ", err)
    res.status(500).send({ success: false, message: "Updating User Failed " });
  }
};


export const deleteUser = async (req, res) => {
  console.log("Delete User Called")
  console.log("Req: ", req.body)
  console.log("Params: ", req.params)
  
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);
    if(!user) {
      return res.status(404).send({ success: false, message: "User not found." });
    }

    if(role === "host"){
      await Host.findOneAndDelete({ user: id });
    }else if(role === "expert"){
      await Expert.findOneAndDelete({ user: id });
    }else if(role === "admin"){
      await Admin.findOneAndDelete({ user: id });
    }

    res.status(200).send({ success: true, message: "Successfully deleted." });
    console.log("User Deleted Successfully!")
  } catch (err) {
    console.log("Error while deleting user: ", err)
    res.status(500).send({ success: false, message: "Deleting User Failed." });
  }
};


export const getUser = async (req, res) => {
  console.log("Get User Called")
  console.log("Params: ", req.params)

  const id = req.params.id;
  console.log("id: ", id)
  try {
    const user = await User.findById(id).populate("events").select("-password");

    if(!user) {
      return res.status(404).send({ success: false, message: "User not found." });
    }

    res
      .status(200)
      .send({ 
        success: true, 
        message: "User Found Successfully.", 
        data: user 
      });
      console.log("User Found Successfully!")
  } catch (err) {
    console.log("Error while getting user: ", err)
    res.status(500).send({ success: false, message: "Error while getting the user." });
  }
};


export const getAllUsers = async (req, res) => {
  const { query } = req.query;
  console.log("Get All Users Called")
  console.log("Query: ", query)

  let users;
  try {
    if (query) {
      users = await User.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } }
        ]
      }).populate("events").select("-password");
    } else {
      users = await User.find({}).select("-password");
    }

    res.status(200).send({
      success: true,
      message: "Successfully find all users",
      data: users
    });
    console.log("All Users Found Successfully!")

  } catch (err) {
    console.log("Error while getting all users:", err);
    res.status(500).send({ success: false, message: "Error while getting all users" });
  }
};



// export const getUserProfile = async (req, res) => {
//   const userId = req.userId;
//   // console.log("userId is : ",userId);
//   // console.log("Getting user profile hare ");
//   try {
//     const user = await User.findById(userId);
//     // console.log("user get like: ",user);
//     if (!user) {
//       return res
//         .status(500)
//         .send({ success: false, message: "User not found" });
//     }

//     const { password, ...rest } = user._doc;
//     res
//       .status(200)
//       .send({
//         success: true,
//         message: "Profile info is getting",
//         user: { ...rest },
//       });
//   } catch (error) {
//     return res
//       .status(500)
//       .send({
//         success: false,
//         message: "Something Went Wrong, can not get !!",
//       });
//   }
// };


// export const getMyAppointment = async (req, res) => {
//   try {
//     //step-1 ---> Retrieve Appointment from booking for the specefic user
//     const bookings = await Booking.find({ user: req.userId });

//     // Step-2 ----> Extract Doctor Id from the appointment
//     const doctorIds = bookings.map((el) => el.doctor.id);

//     // Step-3 ----> Retrieve doctor by using Doctor ID
//     const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
//         '-password -gToken'
//     );

//     res.status(200).send({
//       success: true,
//       message: "Appointments are getting",
//       data: doctors,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: true,
//       message: "Cont find doctors",
//       data: null,
//     });
//   }
// };


export const getEventsByUser = async (req, res) => {
  const userId = req.params.id;
  console.log("Get Events By User Called")
  console.log("userId: ", userId)

  try {
    const user = await User.findById(userId).populate("events").select("events");
    
    if (!user) {
      return res.status(404).send({ success: true, message: "User not found." });
    }
    
    res.status(200).send({ success: true, message: "User events fetched successfully.", data: user.events });
    console.log("User Events Fetched Successfully!")
  } catch (err) {
    console.log("Error while getting user events: ", err);
    res.status(500).send({ success: false, message: "Error while getting user events." });
  }
}


export const getMissedEventsByUser = async (req, res) => {
  console.log("Get Missed Events By User Called")
  console.log("Req: ", req.body)
  console.log("Params: ", req.params)

  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
      .populate({
        path: "events",
        match: { 
          status: "completed", 
          attendees: {
            $elemMatch: { wasPresent: false }
          }
        },
        populate: [
          {
            path: "host",
            select: "user",
            populate: {
              path: "user",
              select: "name email photo"
            }
          },
          {
            path: "attendees.user",
            select: "name email photo"
          },
          {
            path: "topic",
            select: "name"
          }
        ]
      })    
      .select("events");
    
    if (!user) {
      return res.status(404).send({ success: true, message: "User not found." });
    }

    res.status(200).send({ success: true, message: "Missed events fetched successfully.", data: user.events });
    console.log("Missed Events Fetched Successfully!")

  }catch(err){
    console.log("Error while getting missed events: ", err);
    res.status(500).send({ success: false, message: "Error while getting missed events." });
  }
}


export const getCompletedEventsByUser = async (req, res) => {

  console.log("Get Completed Events By User Called")
  console.log("Req: ", req.body)
  console.log("Params: ", req.params)

    const userId = req.params.id;
  try {
    const user = await User.findById(userId)
      .populate({
        path: "events",
        match: { 
          status: "completed", 
          attendees: {
            $elemMatch: { wasPresent: true }
          }
        },
        populate: [
          {
            path: "host",
            select: "user",
            populate: {
              path: "user",
              select: "name email photo"
            }
          },
          {
            path: "attendees.user",
            select: "name email photo"
          },
          {
            path: "topic",
            select: "name"
          }
        ]
      })    
      .select("events");
    
    if (!user) {
      return res.status(404).send({ success: true, message: "User not found." });
    }

    res.status(200).send({ success: true, message: "Completed events fetched successfully.", data: user.events });
    console.log("Completed Events Fetched Successfully!")

  }catch(err){
    console.log("Error while getting completed events: ", err);
    res.status(500).send({ success: false, message: "Error while getting completed events." });
  }
}


export const getUpcomingEventsByUser = async (req, res) => {
  console.log("Get Upcoming Events By User Called")
  console.log("Req: ", req.body)
  console.log("Params: ", req.params)

  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
      .populate({
        path: "events",
        match: { 
          status: "upcoming",
        },
        populate: [
          {
            path: "host",
            select: "user",
            populate: {
              path: "user",
              select: "name email photo"
            }
          },
          {
            path: "attendees.user",
            select: "name email photo"
          },
          {
            path: "topic",
            select: "name"
          }
        ]
      })    
      .select("events");
      
    if (!user) {
      return res.status(404).send({ success: true, message: "User not found." });
    }

    res.status(200).send({ success: true, message: "Upcoming events fetched successfully.", data: user.events });
    console.log("Upcoming Events Fetched Successfully!")

  }catch(err){
    console.log("Error while getting upcoming events: ", err);
    res.status(500).send({ success: false, message: "Error while getting upcoming events." });
  }
}


export const getCancelledEventsByUser = async (req, res) => {
  const userId = req.params.id;
  console.log("Get Cancelled Events By User Called")
  console.log("userId: ", userId)

  try {
    const user = await User.findById(userId)
      .populate({
        path: "events",
        match: { 
          status: "cancelled",
        },
        populate: [
          {
            path: "host",
            select: "user",
            populate: {
              path: "user",
              select: "name email photo"
            }
          },
          {
            path: "attendees.user",
            select: "name email photo"
          },
          {
            path: "topic",
            select: "name"
          }
        ]
      })    
      .select("events");
    
    if (!user) {
      return res.status(404).send({ success: true, message: "User not found." });
    }

    res.status(200).send({ success: true, message: "Cancelled events fetched successfully.", data: user.events });
    console.log("Cancelled Events Fetched Successfully!")
    
  }catch(err){
    console.log("Error while getting cancelled events: ", err);
    res.status(500).send({ success: false, message: "Error while getting cancelled events." });
  }
}