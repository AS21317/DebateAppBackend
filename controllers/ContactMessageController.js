import Message from '../models/MessageSchema.js';
import User from '../models/UserSchema.js';


export const createMessage = async (req, res) => {
    console.log("Create Message Called: ", req.body)

    try {
        const { email, subject, message } = req.body;

        // Check if the email is already registered as a user or doctor
        const user = await User.findOne({ email });
        const isRegistered = !!user;

        // Mark visitor attribute based on registration status
        req.body.visitor = !isRegistered;

        // console.log(req.body);

        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        res.status(200).send({
            success: true,
            message: "Message Sent Successfully"
        });
        console.log("Message Sent Successfully !!")
    } catch (err) {
        console.error("Error during message saving:", err);
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

 
export const getAllMessage = async(req,res)=>{
    console.log("Get All Messages Called")
    try {
        const messages = await Message.find({})
        res.status(200).send({
            success: true,
            message: "Successfully Fetched All Messages",
            data: messages
        })
        console.log("All Messages Fetched Successfully !!")
    } catch (err) {
        console.log("Error while message fetching ",err);
        res.status(500).send({
            success:false,
            message:"Error while fetching messages",
        })
    }
}