import mongoose from "mongoose";

const links = new mongoose.Schema({
    github:{
        type: String,
        required: true
    },
    linkedin:{
        type: String,
        required: true
    },
    instagram:{
        type: String,
        required: true
    },
    facebook:{
        type: String,
        required: true
    },
    whatsapp:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    }
}, { timestamps: true }
);

const Links = mongoose.model('links', links);

export default Links;