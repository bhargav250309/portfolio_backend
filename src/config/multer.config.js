import multer from "multer";
import path from "path";

// Define storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the directory where images will be stored
        cb(null, "./src/uploads"); // This will save images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Use the original name of the file but append a timestamp to avoid file name conflicts
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter to accept only images
// File filter to accept only images (jpeg, png, webp, svg)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp|svg/; // Added webp and svg
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, WebP, and SVG image files are allowed!"), false);
    }
};

// Multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export default upload;
