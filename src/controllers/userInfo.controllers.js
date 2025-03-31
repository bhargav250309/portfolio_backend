// import upload from "../config/multer.config.js";
import UserInfo from "../models/userInfo.models.js";
import { upload } from "../config/cloudinary.config.js";

import fs from 'fs';


export const userInfo = async (req, res) => {
    // Use Multer middleware to handle file upload
    upload.single("image")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        // Now you can access req.body and req.file after Multer has processed the request
        const { navText, designation, userName, shortDesc, email } = req.body;

        const imagePath = req.file ? req.file.path : null;
        const imageName = req.file ? req.file.filename : null;

        try {
            // Check for missing required fields
            if (!navText || !designation || !userName || !shortDesc || !email || !imagePath) {
                return res.json({
                    success: false,
                    message: "All fields are required",
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.json({
                    success: false,
                    message: "Invalid email format",
                });
            }

            // Check if there is already a record in the database (we assume only one user info record is allowed)
            const existingUser = await UserInfo.findOne({});
            if (existingUser) {
                // If a record exists, delete it before inserting the new one
                await UserInfo.deleteOne({ _id: existingUser._id });
            }

            // Create the userInfo document
            const userInfo = await UserInfo.create({
                navText,
                designation,
                userName,
                shortDesc,
                email,
                image: imagePath,
                imageName,
            });

            // Respond with success if all validations pass
            res.status(200).json({
                success: true,
                message: "Data added successfully",
                data: userInfo,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
};

export const updateUserInfo = async (req, res) => {
    const { userId } = req.params;  // Assuming userId is passed as a URL parameter

    // Use Multer middleware to handle image upload if it exists
    upload.single("image")(req, res, async (err) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message,
            });
        }

        try {
            const { navText, designation, userName, shortDesc, email } = req.body;

            const user = await UserInfo.findOne({ _id: userId });
            if (!user) {
                return res.json({
                    success: false,
                    message: "User not found"
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                });
            }

            // Check if new image is uploaded
            let imagePath = user.image; // Keep the old image path if no new image is uploaded
            let imageName = user.imageName; // Keep the old image name if no new image is uploaded

            // If a new image is uploaded, update the image path
            if (req.file) {
                imagePath = req.file.path;
                imageName = req.file.filename;

                // Delete old image from the server if a new one is uploaded
                const oldImagePath = user.imageName;
                if (oldImagePath && fs.existsSync(`./src/uploads/${oldImagePath}`)) {
                    fs.unlinkSync(`./src/uploads/${oldImagePath}`);
                }
            }

            // Update the user's data
            if (navText) user.navText = navText;
            if (designation) user.designation = designation;
            if (userName) user.userName = userName;
            if (shortDesc) user.shortDesc = shortDesc;
            if (email) user.email = email;

            // Update image fields
            user.image = imagePath;
            user.imageName = imageName;

            await user.save();

            res.json({
                success: true,
                message: "User data updated successfully",
                data: user
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
};

export const deleteUserInfo = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await UserInfo.findByIdAndDelete({ _id: userId });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const oldImagePath = user.imageName;
        if (oldImagePath && fs.existsSync(`./src/uploads/${oldImagePath}`)) {
            fs.unlinkSync(`./src/uploads/${oldImagePath}`);
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const getUserInfo = async (req, res) => {
    try {
        // Find all users
        const users = await UserInfo.findOne();

        // If no users found, return an error response
        if (!users || users.length === 0) {
            return res.json({
                success: false,
                message: "No users found"
            });
        }

        const protocol = req.protocol; // 'http' or 'https'
        const host = req.get('host'); // e.g., 'localhost:5000'
        const imageUrl = `${protocol}://${host}/uploads/images/${users.imageName}`;

        // Map through each user to add the imageUrl
        const usersWithImageUrl = {
            ...users.toObject(),
            imageUrl: users.image // Cloudinary URL instead of local path
        };


        // Return the user data if found
        res.status(200).json({
            success: true,
            message: "Users data retrieved successfully",
            data: usersWithImageUrl
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
