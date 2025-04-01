import mongoose from "mongoose";

const projectInfo = new mongoose.Schema({
    projectImage: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    stack: { type: [String], required: true },
    priviewLink: { type: String, required: true },
    githubLink: { type: String, required: true },
    imageName: { type: String } // This stores Cloudinary public_id
}, { timestamps: true });

const Project = mongoose.model('projects', projectInfo);
export default Project;
