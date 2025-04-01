import mongoose from "mongoose";

const stackSchema = new mongoose.Schema(
    {
        stackName: { type: String, required: true },
        stackImage: { type: String }, // Cloudinary URL
        imageName: { type: String },  // Cloudinary public ID
    },
    { timestamps: true }
);

export default mongoose.model("Stack", stackSchema);
