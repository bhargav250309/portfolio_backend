import mongoose from "mongoose";

const aboutUser = new mongoose.Schema(
    {
        userName:{
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        aboutImage: {
            type: String,
            required: true
        },
        imageName:{
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const About = mongoose.model('about', aboutUser);

export default About;