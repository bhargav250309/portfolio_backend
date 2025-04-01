// import multer from "multer";
// import path from "path";

// // Define storage options
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // Specify the directory where images will be stored
//         cb(null, "./src/uploads"); // This will save images in the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         // Use the original name of the file but append a timestamp to avoid file name conflicts
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// // File filter to accept only images
// // File filter to accept only images (jpeg, png, webp, svg)
// const fileFilter = (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|webp|svg/; // Added webp and svg
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         cb(new Error("Only JPG, PNG, WebP, and SVG image files are allowed!"), false);
//     }
// };

// // Multer upload instance
// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// });

// export default upload;


import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "user_uploads",
        allowed_formats: ["jpeg", "jpg", "png", "webp", "svg"],
        public_id: (req, file) => Date.now() + "-" + file.originalname, // Unique public_id
    },
});


const upload = multer({ storage });

export { cloudinary, upload };
