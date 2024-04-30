import HostApplication from "../models/HostApplicationSchema.js";
import User from "../models/UserSchema.js";


// creates a host application by user id
export const createHostApplication = async (req, res) => {
    const userId = req.params.id;   
    const { applicationForm, expertise } = req.body;
    
    console.log("Create Host Application Called")
    console.log("Req: ", req.body)
    console.log("userId: ", userId)

    try{
        const updatedUser = await User.findByIdAndUpdate(userId,
            { appliedForHost: true },
            { new: true }
        );
        if(!updatedUser){
            return res.status(404).send({ status: false, message: "User not found." });
        }
    
        const hostApplication = await HostApplication.create({ 
            user: userId, 
            applicationForm: applicationForm, 
            expertise: expertise,
        });
        
        res.status(200).send({ status: true, message: "Successfully Applied!", data: { user: updatedUser, hostApplication} });
        console.log("Host Application Created Successfully!")
    }catch(err){
        console.log("Error while applying for host: ", err);
        res.status(500).send({ status: false, message: "Error while applying for host." });
    }
}
  

// deletes a host application by user id
export const deleteHostApplication = async (req, res) => {
    console.log("Delete Host Application Called")
    const userId = req.params.id;
    console.log("userId: ", userId)

    try{
        const hostApplication = await HostApplication.findOneAndDelete({ user: userId });

        if(!hostApplication){
            return res.status(404).send({ status: false, message: "Host Application not found." });
        }

        const user = await User.findByIdAndUpdate(userId,
            { appliedForHost: false },
            { new: true }
        )
      
        res.status(200).send({ status: true, message: "Successfully Deleted Application!", data: user });
        console.log("Host Application Deleted Successfully!")
    }catch(err){
        console.log("Error while deleting host application: ", err);
        res.status(500).send({ status: false, message: "Error while deleting host application." });
    }
}


// get host application by user id
export const getHostApplication = async (req, res) => {
    const userId = req.params.id;
    console.log("Get Host Application Called")
    console.log("userId: ", userId)

    try {
        const hostApplication = await HostApplication.findOne({ user: userId })
            .populate({
                path: "user",
                select: "-password"
            });
        

        if(!hostApplication){
            return res.status(404).send({ status: false, message: "Host Application not found." });
        }

        res.status(200).send({ status: true, message: "Host Application Fetched Successfully!", data: hostApplication });
        console.log("Host Application Fetched Successfully!")
    } catch (err) {
        console.log("Error while getting host application: ", err);
        res.status(500).send({ status: false, message: "Error while getting host application." });
    }
}

// update host application by user id
export const updateHostApplication = async (req, res) => {
    
    const userId = req.params.id;
    console.log("Update Host Application Called")
    console.log("userId: ", userId)

    const { applicationForm } = req.body;
    try {
        const updatedHostApplication = await HostApplication.findByIdAndUpdate(userId,
            { applicationForm },
            { new: true }
        );

        if(!updatedHostApplication){
            return res.status(404).send({ status: false, message: "Host Application not found." });
        }

        res.status(200).send({ status: true, message: "Successfully updated host application!", data: updatedHostApplication });
        console.log("Host Application Updated Successfully!")

    } catch (err) {
        console.log("Error while updating host application: ", err);
        res.status(500).send({ status: false, message: "Error while updating host application." });
    }
}


// get all pending host applications
export const getHostApplicationsByStatus = async (req, res) => {
    const { status } = req.body;
    console.log("Get Host Applications By Status Called")
    console.log("Status: ", status)

    try {
        const applications = await HostApplication.find({ status })
            .populate({
                path: "user",
                select: "-password"
            });
        
        res.status(200).send({ status: true, message: "Host Application Fetched Successfully!", data: applications });
        console.log("Host Applications Fetched Successfully!")

    } catch (err) {
        console.log("Error while getting host applications by status: ", err);
        res.status(500).send({ status: false, message: "Error while getting host applications by status." });
    }
}


// get all host applications
export const getAllApplications = async (req, res) => {
    console.log("Get All Applications Called")
    console.log("Req Body ", req.body)
    try {
        const hostApplications = await HostApplication.find({})
            .populate({
                path: "user",
                select: "-password"
            });

        res.status(200).send({ status: true, message: "Host Application Fetched Successfully!", data: hostApplications });
    } catch (err) {
        console.log("Error while getting host application: ", err);
        res.status(500).send({ status: false, message: "Error while getting host application." });
    }
}

