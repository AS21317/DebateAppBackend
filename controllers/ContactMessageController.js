import Message from '../models/ContactMessage.js';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';

export const createMessage = async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        // Check if the email is already registered as a user or doctor
        const user = await User.findOne({ email });
        const doctor = await Doctor.findOne({ email });
        const isRegistered = !!user || !!doctor;

        // Mark visitor attribute based on registration status
        req.body.visitor = !isRegistered;

        console.log(req.body);

        // Create a new message instance
        const newMessage = new Message(req.body);

        // Save the message
        const savedMessage = await newMessage.save();

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "Message Sent Successfully"
        });
    } catch (err) {
        console.error("Error during message saving:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

 
export const getAllMessage = async(req,res)=>{
    try {
        const messages = await Message.find({})
        res.status(200).json({
            success:true,
            message:"Successfully Find ",
            data:messages
        })

    } catch (err) {
        console.log("Error while message fetching ",err);
        res.status(404).json({
            success:false,
            message:"No message Found",
        })
    }
}
