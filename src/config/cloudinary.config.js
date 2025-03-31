import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config(); // Load environment variables

// Configure Cloudinary with your API credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "user_uploads", // Cloudinary folder name
        format: async (req, file) => "png", // Convert to PNG (optional)
        public_id: (req, file) => Date.now() + "-" + file.originalname,
    },
});

const upload = multer({ storage });

export { cloudinary, upload };
