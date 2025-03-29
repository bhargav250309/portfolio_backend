import mongoose from "mongoose";

const Contact = new mongoose.Schema(
    {
        contactName: {
            type: String,
            required: true
        },
        contactEmail: {
            type: String,
            required: true
        },
        contactMessage: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

const ContactMessage = mongoose.model('contactMessages', Contact);

export default ContactMessage;