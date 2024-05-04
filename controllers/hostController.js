import Host from "../models/HostSchema.js";


export const updateHost = async (req, res) => {
  console.log("Update Host Called")
  console.log("Req: ", req.body)

  const userId = req.params.id;
  console.log("userId: ", userId)
  try {
    const updatedHost = await Host.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    ).select('-gToken');

    if(!updatedHost){
      return res.status(404).send({ success: false, message: "Host Not Found." });
    }

    res
      .status(200)
      .send({
        success: true,
        message: "Successfully Updated Host Details.",
        data: updatedHost,
      });
      console.log("Host Updated Successfully!")
  } catch (err) {
    console.log("Error while updating host: ", err)
    res.status(500).send({ success: false, message: "Error while updating host." });
  }
};


export const deleteHost = async (req, res) => {
  const userId = req.params.id;
  console.log("Delete Host Called")
  console.log("Req: ", req.body)
  console.log("Params: ", req.params)

  try {
    const host = await Host.findByIdAndDelete(userId);

    if(!host){
      return res.status(404).send({ success: false, message: "Host Not Found." });
    }

    res.status(200).send({ success: true, message: "Successfully deleted host." });
    console.log("Host Deleted Successfully!")
  } catch (err) {
    console.log("Error while deleting host: ", err)
    res.status(500).send({ success: false, message: "Error while deleting host." });
  }
};


export const getHost = async (req, res) => {
  const userId = req.params.id;
  console.log("Get Host Called with id: ", userId)


  try {
    const host = await Host.findById(userId)
      .populate({
        path: "user",
        select: "-password"
      })
      .populate({
        path: "events",
        populate: {
          path: "host",
          select: "-gToken",
        },
      })

      if(!host){
        return res.status(404).send({ success: false, message: "Host Not Found." });
      }

    res
      .status(200)
      .send({ success: true, message: "Successfully Fetched Host Details", data: host });
      console.log("Host Fetched Successfully!")

  } catch (err) {
    console.log("Error while fetching host details: ", err);
    res.status(500).send({ success: false, message: "Error while fetching host details." });
  }
};


export const getAllHosts = async (req, res) => {
  console.log("Get All Hosts Called")
  console.log("Req: ", req.body)
  console.log("Query: ", req.query)
  // here we need to apply filter also acc to req demand
  // Query parameters are used to filter the data based on specefic criteria

  const { query, limit } = req.query;
  try {
    let hosts = await Host.find({})
      .populate('user')
      .select('-password -gToken');

    if (query) {
      hosts = hosts.filter(host => {
        return (
          host.user.name.toLowerCase().includes(query.toLowerCase()) ||
          host.user.email.toLowerCase().includes(query.toLowerCase())
        );
      });
    }

    hosts.sort((a, b) => {
      const eventsLengthComparison = b.events.length - a.events.length;
      if (eventsLengthComparison === 0) {
        return b.user.rating - a.user.rating;
      }
      return eventsLengthComparison;
    });

    if(limit) hosts = hosts.slice(0, limit);
    

    res
      .status(200)
      .send({
        success: true,
        message: "Successfully Fetched All Hosts",
        data: hosts,
      });
      console.log("All Hosts Fetched Successfully!")
      
  } catch (err) {
    console.log("Error while fetching all hosts: ", err)
    res
      .status(500)
      .send({ success: false, message: "Error while fetching all hosts." });
  }
};


// export const doctorProfile = async (req, res) => {
//   const doctorId = req.userId;
//   // console.log("Doctor id is : ",doctorId);
//   try {
//     const doctor = await Doctor.findById(doctorId);
//     if (!doctor) {
//       return res
//         .status(500)
//         .send({ success: false, message: "doctor not found" });
//     }
//     // console.log("Founded docter is : ", doctor._doc);

//     const { password, ...rest } = doctor._doc;
//     const appointments = await Host.find({ doctor: doctorId });

//     // console.log("Appointments are  : ",appointments);
//     return res
//       .status(200)
//       .send({
//         success: true,
//         message: "Profile info is getting",
//         data: { ...rest, appointments },
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
