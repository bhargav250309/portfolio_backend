import mongoose from "mongoose";

const userInfo = new mongoose.Schema(
    {
        navText: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        shortDesc: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        image:{
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

const UserInfo = mongoose.model('userInfo',userInfo);

export default UserInfo;