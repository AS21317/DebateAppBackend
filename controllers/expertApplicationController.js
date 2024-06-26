import ExpertApplicationSchema from '../models/ExpertApplicationSchema.js';
import ExpertSchema from '../models/ExpertSchema.js';
import User from '../models/UserSchema.js';


// Helper Functions

// Populates the expert schema
const populate = async (expert) => {
    await expert.populate({
        path: "user",
        select: "-password"
    })
}


// REST API Controller

export const createExpertApplication = async (req, res) => {    
    const expertApplication = req.body;

    console.log("Create ExpertApplication called")
    console.log("Req. Body: ", expertApplication)

    const { user: userId } = expertApplication
    try {
        let user = await User.findById(userId);
        if(!user){
            res.status(404).send({ success: false, message: "User not found" });
            console.log("User not found")
            return;
        }

        if(user.appliedForExpert){
            res.status(400).send({ success: false, message: "User already applied for expert" });
            console.log("User already applied for expert")
            return;
        }

        user = await User.findByIdAndUpdate(userId, { appliedForExpert: true }, { new: true });

        const newExpertApplication = new ExpertApplicationSchema(expertApplication);
        await newExpertApplication.save();

        await populate(newExpertApplication);

        res.status(200).send({ success: true, message: "ExpertApplication created successfully", data: { expertApplication: newExpertApplication, user } });
        console.log("ExpertApplication created successfully")
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error while creating expert Application" });
    }
}


export const getExpertApplication = async (req, res) => {
    const { ...rest } = req.query;

    console.log("Getting expert application");
    console.log("Query: ", rest)

    try {
        const expertApplications = await ExpertApplicationSchema.find(rest);
        for (let i = 0; i < expertApplications.length; i++) {
            await populate(expertApplications[i]);
        }

        res.status(200).send({ success: true, message: "Expert Application found successfully", data: expertApplications });
        console.log("Expert Application found successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting expert application" });
    }
}


export const updateExpertApplication = async (req, res) => {
    const userId = req.params.userId;
    const expertApplication = req.body;

    console.log("Updating expert application with userId: ", userId);
    console.log("Req. Body: ", expertApplication);

    try {
        const updatedExpertApplication = await ExpertApplicationSchema.findOneAndUpdate(
            { user: userId }, 
            expertApplication, { new: true });
        if(!updatedExpertApplication) {
            res.status(404).send({ success: false, message: "Expert Application not found" });
            console.log("Expert Application not found");
            return;
        }

        await populate(updatedExpertApplication);

        res.status(200).send({ success: true, message: "Expert Application updated successfully", data: updatedExpertApplication });
        console.log("Expert Application updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while updating expert application" });
    }
}


export const deleteExpertApplication = async (req, res) => {
    const userId = req.params.userId;
    console.log("Deleting expert application with userId: ", userId);

    try {
        const expertApplication = await ExpertApplicationSchema.findOneAndDelete({ user: userId });
        if(!expertApplication) {
            res.status(404).send({ success: false, message: "Expert Application not found" });
            console.log("Expert Application not found");
            return;
        }

        await populate(expertApplication);

        res.status(200).send({ success: true, message: "Expert Application deleted successfully", data: expertApplication });
        console.log("Expert Application deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while deleting expert application" });
    }
}


export const approveExpertApplication = async (req, res) => {
    const id = req.params.id;
    console.log("Approving expert application with id: ", id);

    try {
        let expertApplication = await ExpertApplicationSchema.findById(id);
        if(!expertApplication) {
            res.status(404).send({ success: false, message: "Expert Application not found" });
            console.log("Expert Application not found");
            return;
        }
        if(expertApplication.status === "approved") {
            res.status(400).send({ success: false, message: "Expert Application already approved" });
            console.log("Expert Application already approved");
            return;
        }

        expertApplication = await ExpertApplicationSchema.findByIdAndUpdate(
            id,
            { status: "approved" }, 
            { new: true }
        );

        const user = await User.findByIdAndUpdate(expertApplication.user, { role: "expert" }, { new: true });

        const { _id, ...rest } = expertApplication.toObject();
        const expert = new ExpertSchema(rest)
        await expert.save();

        // await populate(expertApplication);
        // await populate(expert);

        res.status(200).send({ success: true, message: "Expert Application approved successfully", data: { expertApplication, expert, user } });
        console.log("Expert Application approved successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while approving expert application" });
    }
}


