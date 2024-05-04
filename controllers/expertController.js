import ExpertSchema from "../models/ExpertSchema";
import User from "../models/User";
import { sendEmail } from '../controllers/nodeMailer.js'

// Helper Functions

// Populates the expert schema
const populate = async (expert) => {
    await expert.populate({
        path: "user",
        select: "name email photo age gender qualifications experiences bio about socials"
    })
}


// REST API Controllers

const getExpert = async (req, res) => {
    const userId = req.params.userId;
    const { ...rest } = req.query;
    console.log("Getting expert with userId: ", userId);

    try {
        const expert = await ExpertSchema.find({ user: userId, ...rest });
        if(!expert) {
            res.status(404).send({ success: false, message: "Expert not found" });
            console.log("Expert not found");
            return;
        }

        await populate(savedExpert);

        res.status(200).send({ success: true, message: "Successfully Fetched Expert", data: expert });
        console.log("Expert found: ", expert);
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error while getting expert" });
    }
}


const updateExpert = async (req, res) => {
    const userId = req.params.userId;
    console.log("Updating expert with userId: ", userId);

    try {
        const expert = await ExpertSchema.findOne({ user: userId });
        if(!expert) {
            res.status(404).send({ success: false, message: "Expert not found" });
            console.log("Expert not found");
            return;
        }

        const { ...rest } = req.body;
        const updatedExpert = await ExpertSchema.findOneAndUpdate(
            { user: userId }, 
            rest, 
            { new: true }
        );

        await populate(updatedExpert);

        res.status(200).send({ success: true, message: "Expert updated successfully", data: updatedExpert });
        console.log("Expert updated successfully");
    } catch(err){
        console.log(err);
        res.status(500).send({ success: false, message: "Error while updating expert" });
    }
}


const deleteExpert = async (req, res) => {
    const userId = req.params.userId;
    console.log("Deleting expert with userId: ", userId);

    try {
        const expert = await ExpertSchema.findById({ user: userId });
        if(!expert) {
            res.status(404).send({ success: false, message: "Expert not found" });
            console.log("Expert not found");
            return;
        }

        await ExpertSchema.findOneAndDelete({ user: userId });

        res.status(200).send({ success: true, message: "Expert deleted successfully" });
        console.log("Expert deleted successfully");
    } catch(err){
        console.log(err);
        res.status(500).send({ success: false, message: "Error while deleting expert" });
    }
}


export { getExpert, updateExpert, deleteExpert };
