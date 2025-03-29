import mongoose from "mongoose";

const stack = new mongoose.Schema(
    {
        stackName: {
            type: String,
            required: true
        },
        stackImage: {
            type: String,
            // required: true
        },
        imageName:{
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Stack = mongoose.model('stacks', stack);

export default Stack;