import mongoose from "mongoose";

const stack = new mongoose.Schema(
    {
        stackName: {
            type: String,
            required: true
        },
        stackImage: {
            type: String,
        },
        imageName:{
            type: String,
        }
    },
    { timestamps: true }
);

const Stack = mongoose.model('stacks', stack);

export default Stack;