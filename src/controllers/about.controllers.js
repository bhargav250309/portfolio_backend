// import {upload} from "../config/multer.config.js";
// import About from "../models/about.models.js";
// import fs from 'fs';

// // create AboutUser controller
// export const createAboutUser = async (req, res) => {
//     // Use Multer middleware to handle file upload for aboutImage
//     UploadStream.single('aboutImage')(req, res, async (err) => {
//         if (err) {
//             return res.json({
//                 success: false,
//                 message: err.message,
//             });
//         }

//         const { userName, description } = req.body;
//         const aboutImage = req.file ? req.file.path : null;  // Store the file path
//         const imageName = req.file.filename

//         try {
//             // Check if userName, description, and aboutImage are provided
//             if (!userName || !description || !aboutImage) {
//                 return res.json({
//                     success: false,
//                     message: "All fields including aboutImage are required"
//                 });
//             }

//             const existingUser = await About.findOne({});
//             if (existingUser) {
//                 // If a record exists, delete it before inserting the new one
//                 await About.deleteOne({ _id: existingUser._id });
//             }

//             // Create new aboutUser
//             const aboutUser = await About.create({
//                 userName,
//                 description,
//                 aboutImage,  // aboutImage is required, it cannot be null
//                 imageName: imageName
//             });

//             res.status(201).json({
//                 success: true,
//                 message: "About user created successfully",
//                 data: aboutUser
//             });

//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: "Internal Server Error"
//             });
//         }
//     });
// };

// // updateAboutUser controller
// export const updateAboutUser = async (req, res) => {
//     const { aboutUserId } = req.params;

//     // Use Multer middleware to handle file upload for aboutImage
//     upload.single('aboutImage')(req, res, async (err) => {
//         if (err) {
//             return res.json({
//                 success: false,
//                 message: err.message,
//             });
//         }
//         const { userName, description } = req.body;

//         try {
//             // Find user by ID
//             const aboutUser = await About.findById(aboutUserId);
//             if (!aboutUser) {
//                 return res.json({
//                     success: false,
//                     message: "No about user found"
//                 });
//             }

//             const aboutImage = req.file ? req.file.path : aboutUser.aboutImage;
//             const imageName = req.file ? req.file.filename : aboutUser.imageName;

//             if (userName) {
//                 aboutUser.userName = userName;
//             }
//             if (description) {
//                 aboutUser.description = description;
//             }

//             // Check if a new image is provided
//             if (req.file) {
//                 const oldImagePath = aboutUser.imageName;

//                 // Check if old image exists in the uploads folder
//                 if (oldImagePath && fs.existsSync(`./src/uploads/${oldImagePath}`)) {
//                     fs.unlinkSync(`./src/uploads/${oldImagePath}`);
//                 }

//                 aboutUser.aboutImage = aboutImage;
//                 aboutUser.imageName = imageName;
//             }

//             // Save the updated user data
//             await aboutUser.save();

//             res.status(200).json({
//                 success: true,
//                 message: "About user updated successfully",
//                 data: aboutUser
//             });

//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: "Internal Server Error"
//             });
//         }
//     });
// };

// // deleteAboutUser controller
// export const deleteAboutUser = async (req, res) => {
//     const { aboutUserId } = req.params;

//     try {
//         const aboutUser = await About.findById(aboutUserId);

//         if (!aboutUser) {
//             return res.json({
//                 success: false,
//                 message: "No about user found"
//             });
//         }

//         const oldImagePath = aboutUser.imageName;
//         // Check if old image exists in the uploads folder
//         if (oldImagePath && fs.existsSync(`./src/uploads/${oldImagePath}`)) {
//             fs.unlinkSync(`./src/uploads/${oldImagePath}`);
//         }

//         // Delete the about user
//         await aboutUser.deleteOne();

//         res.status(200).json({
//             success: true,
//             message: "About user deleted successfully"
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };

// // getAboutUser controller
// export const getAboutUser = async (req, res) => {
//     try {
//         const aboutUser = await About.findOne();

//         if (!aboutUser) {
//             return res.json({
//                 success: false,
//                 message: "No about user found"
//             });
//         }

//         const protocol = req.protocol; // 'http' or 'https'
//         const host = req.get('host'); // e.g., 'localhost:5000'
//         const imageUrl = `${protocol}://${host}/uploads/images/${aboutUser.imageName}`;

//         res.json({
//             success: true,
//             message: "About user retrieved successfully",
//             data: {
//                 ...aboutUser.toObject(),
//                 imageUrl,
//             }
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };



import About from "../models/about.models.js";
import { upload, cloudinary } from "../config/multer.config.js";

export const createAboutUser = async (req, res) => {
    upload.single('aboutImage')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        const { userName, description } = req.body;
        const file = req.file;

        if (!userName || !description || !file) {
            return res.status(400).json({
                success: false,
                message: "All fields including aboutImage are required",
            });
        }

        try {
            const existingUser = await About.findOne();
            if (existingUser) {
                return res.status(400).json({ success: false, message: "About user already exists" });
            }

            // Upload image to Cloudinary
            const uploadResponse = await cloudinary.uploader.upload(file.path);

            const newAboutUser = await About.create({
                userName,
                description,
                aboutImage: uploadResponse.secure_url,
                imageName: uploadResponse.public_id,
            });

            res.status(201).json({
                success: true,
                message: "About user created successfully",
                data: newAboutUser,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    });
};


export const updateAboutUser = async (req, res) => {
    const { aboutUserId } = req.params;

    upload.single('aboutImage')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        const { userName, description } = req.body;

        try {
            const aboutUser = await About.findById(aboutUserId);
            if (!aboutUser) {
                return res.status(404).json({ success: false, message: "About user not found" });
            }

            if (userName) aboutUser.userName = userName;
            if (description) aboutUser.description = description;

            if (req.file) {
                // Delete old image from Cloudinary
                if (aboutUser.imageName) {
                    await cloudinary.uploader.destroy(aboutUser.imageName);
                }

                // Upload new image
                const uploadResponse = await cloudinary.uploader.upload(req.file.path);
                aboutUser.aboutImage = uploadResponse.secure_url;
                aboutUser.imageName = uploadResponse.public_id;
            }

            await aboutUser.save();

            res.status(200).json({
                success: true,
                message: "About user updated successfully",
                data: aboutUser,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    });
};


export const deleteAboutUser = async (req, res) => {
    const { aboutUserId } = req.params;

    try {
        const aboutUser = await About.findById(aboutUserId);
        if (!aboutUser) {
            return res.status(404).json({ success: false, message: "About user not found" });
        }

        // Delete image from Cloudinary
        if (aboutUser.imageName) {
            await cloudinary.uploader.destroy(aboutUser.imageName);
        }

        await aboutUser.deleteOne();

        res.status(200).json({
            success: true,
            message: "About user deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const getAboutUser = async (req, res) => {
    try {
        const aboutUser = await About.findOne();
        if (!aboutUser) {
            return res.status(404).json({ success: false, message: "No about user found" });
        }

        res.status(200).json({
            success: true,
            message: "About user retrieved successfully",
            data: aboutUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
