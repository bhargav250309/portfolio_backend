import UserInfo from "../models/userInfo.models.js";

export const userInfo = async (req, res) => {
    try {
        const { navText, designation, userName, shortDesc, email } = req.body;

        // Check for missing required fields
        if (!navText || !designation || !userName || !shortDesc || !email) {
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

        // Check if there is already a record in the database
        const existingUser = await UserInfo.findOne({});
        if (existingUser) {
            await UserInfo.deleteOne({ _id: existingUser._id });
        }

        // Create the userInfo document
        const userInfo = await UserInfo.create({
            navText,
            designation,
            userName,
            shortDesc,
            email
        });

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
};

export const updateUserInfo = async (req, res) => {
    const { userId } = req.params;

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

        // Update the user's data
        if (navText) user.navText = navText;
        if (designation) user.designation = designation;
        if (userName) user.userName = userName;
        if (shortDesc) user.shortDesc = shortDesc;
        if (email) user.email = email;

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
};

export const getUserInfo = async (req, res) => {
    try {
        const user = await UserInfo.findOne();

        if (!user) {
            return res.json({
                success: false,
                message: "No users found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User data retrieved successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
