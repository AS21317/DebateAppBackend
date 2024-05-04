import mongoose from "mongoose"

const ExpertSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expertise: { 
            type: [String], 
            required: true 
        },
        resumeLink: { type: String },
        
        // experTalk events conducted by the expert
        events: [{
            type: mongoose.Types.ObjectId,
            ref: "Event",
        }],
    },
    { timestamps: true}
)

export default mongoose.model("Expert", ExpertSchema)