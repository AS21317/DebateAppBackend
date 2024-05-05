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

const createExpert = async (req, res) => {
    console.log("Create Expert Called: ", req.body);

    const { userId } = req.params;
    const { ...rest } = req.body;
    console.log("userId: ", userId);

    try {
        const user = await User.findById(userId);
        if(!user) {
            res.status(404).send({ success: false, message: "User not found" });
            console.log("User not found");
            return;
        }

        const expert = await ExpertSchema.findOne({ user: userId });
        if(expert) {
            res.status(400).send({ success: false, message: "Expert already exists" });
            console.log("Expert already exists");
            return;
        }

        const newExpert = new ExpertSchema({ user: userId, ...rest });
        const savedExpert = await newExpert.save();

        await populate(savedExpert);

        const subject = "Expert Profile Created";
        const text = `Dear ${user.name},

        We are thrilled to inform you that you have been promoted to the position of Expert within our community. This promotion is a testament to your dedication, expertise, and valuable contributions to our community.
        
        As an Expert, you will play a crucial role in guiding and supporting other members, sharing your knowledge, and helping to foster a collaborative and enriching environment for everyone.
        
        We have recognized your exceptional skills and commitment, and we are confident that you will continue to excel in your new role. Your insights and expertise will be instrumental in shaping the future of our community.
        
        Please accept our heartfelt congratulations on this well-deserved promotion. We look forward to seeing the positive impact you will make as an Expert.
        
        If you have any questions or need further information about your new role, please feel free to reach out to us. We are here to support you every step of the way.
        
        Once again, congratulations on this achievement!
        
        Best regards,
        SpeakIndia Team`

        sendEmail(user.email, subject, text);

        res.status(200).send({ success: true, message: "Expert created successfully", data: savedExpert });
        console.log("Expert Created Successfully !!");
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error while creating expert" });
    }
}


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

        const user = await User.findById(userId);

        const subject = "Termination of Services with SpeakIndia";
        const text = `Dear ${user.name},

        We regret to inform you that, after careful consideration, we have decided to terminate your services as a member of our community effective [termination date]. 
        
        We understand that this news may come as a disappointment, and we want to express our gratitude for the contributions you have made during your time with us. Your expertise and dedication have been valued assets to our community.
        
        Please note that this termination does not diminish the respect we have for you as a professional. We believe that this decision is in the best interest of both parties and will allow us to be our better selves moving forward.
        
        If you have any questions or require further clarification regarding this decision, please do not hesitate to reach out to us. We are available to discuss the matter further and provide any assistance you may need.
        
        We wish you all the best in your future endeavors.
        
        Sincerely,
        SpeakIndia Team`;

        sendEmail(user.email, subject, text);

        res.status(200).send({ success: true, message: "Expert deleted successfully" });
        console.log("Expert deleted successfully");
    } catch(err){
        console.log(err);
        res.status(500).send({ success: false, message: "Error while deleting expert" });
    }
}


export { createExpert, getExpert, updateExpert, deleteExpert };
