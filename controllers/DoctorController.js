import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ); // new true option will return updated Doctor

    res
      .status(200)
      .json({
        success: true,
        message: "Successfully updated",
        data: updatedDoctor,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Updation Failed " });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion Failed " });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select('-password -gToken');

    res
      .status(200)
      .json({ success: true, message: "Successfully Find", data: doctor });
  } catch (err) {
    res.status(404).json({ success: false, message: "No Doctor Found " });
  }
};

export const getAllDoctor = async (req, res) => {
  // here we need to apply filter also acc to req demand
  // Query parameters are used to filter the data based on specefic criteria

  const { query } = req.query;
  let doctors;

  try {
    if (query) {
      // we will search from only those doctors which are approved

      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select('-password -gToken');
    } else {
      //if no query then find all docotrs
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        '-password -gToken'
      );
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Successfully Find All Doctors",
        data: doctors,
      });
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: "Failed due to some Error " });
  }
};

export const doctorProfile = async (req, res) => {
  const doctorId = req.userId;
  // console.log("Doctor id is : ",doctorId);
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "doctor not found" });
    }
    // console.log("Founded docter is : ", doctor._doc);
    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });
    // console.log("Appointments are  : ",appointments);
    return res
      .status(200)
      .json({
        success: true,
        message: "Profile info is getting",
        data: { ...rest, appointments },
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
