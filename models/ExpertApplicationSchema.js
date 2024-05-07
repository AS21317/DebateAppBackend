import mongoose from "mongoose";

const ExpertApplicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        expertise: {
            type: [String],
            required: true
        },
        resumeLink: { type: String },
        message: { type: String },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        reasonIfRejected: {
            type: String
        },
    },
    { timestamps: true }
)

export default mongoose.model("ExpertApplication", ExpertApplicationSchema);
