import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";


export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ); // new true option will return updated user

    res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated",
        data: updatedUser,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Updation Failed " });
  }
};


export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id); // new true option will return updated user

    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion Failed " });
  }
};


export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res
      .status(200)
      .json({ success: true, message: "Successfully Find", data: user });
  } catch (err) {
    res.status(404).json({ success: false, message: "No User Found " });
  }
};


export const getAllUser = async (req, res) => {
  const id = req.params.id;

  try {
    const users = await User.find({}).select("-password"); //it will exclude the password to be fetched

    res
      .status(200)
      .json({
        success: true,
        message: "Successfully Find All users",
        data: users,
      });
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Failed due to some Error " });
  }
};


export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  // console.log("userId is : ",userId);
  // console.log("Getting user profile hare ");
  try {
    const user = await User.findById(userId);
    // console.log("user get like: ",user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;
    res
      .status(200)
      .json({
        success: true,
        message: "Profile info is getting",
        data: { ...rest },
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Something Went Wrong, can not get !!",
      });
  }
};


export const getMyAppointment = async (req, res) => {
  try {
    //step-1 ---> Retrieve Appointment from booking for the specefic user
    const bookings = await Booking.find({ user: req.userId });

    // Step-2 ----> Extract Doctor Id from the appointment
    const doctorIds = bookings.map((el) => el.doctor.id);

    // Step-3 ----> Retrieve doctor by using Doctor ID
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
        '-password -gToken'
    );

    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Cont find doctors",
      data: null,
    });
  }
};
