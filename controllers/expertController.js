import ExpertSchema from "../models/ExpertSchema.js";
import User from "../models/UserSchema.js";
import { sendEmail } from '../controllers/nodeMailer.js'

// Helper Functions

// Populates the expert schema
const populate = async (expert) => {
    await expert.populate({
        path: "user",
        select: "-password",
    })
}


// REST API Controllers

const getExpert = async (req, res) => {
    const { userId, ...rest } = req.query;
    console.log("Getting expert with userId: ", userId);
    console.log("Query: ", req.query)

    let expert;
    try {
        if(userId){
            expert = await ExpertSchema.find({ user: userId, ...rest });
            await populate(expert)
        }else{
            console.log("Fetching all")
            expert = await ExpertSchema.find({})
            await Promise.all(expert.map(async (exp) => {
                await populate(exp);
            }));
        }

        if(!expert) {
            res.status(404).send({ success: false, message: "Expert not found" });
            console.log("Expert not found");
            return;
        }

        res.status(200).send({ success: true, message: "Successfully Fetched Expert", data: expert });
        console.log("Expert found");
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


export { getExpert, updateExpert, deleteExpert };
