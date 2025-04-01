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
        },
        imageName:{
            type: String,
        }
    },
    { timestamps: true }
);

const About = mongoose.model('about', aboutUser);

export default About;