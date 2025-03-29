import User from "../models/auth.models.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

// Register user
export const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    try {
        // Check if fields are missing
        if (!userName || !email || !password) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        // Validate password format
        if (!passwordRegex.test(password)) {
            return res.json({
                success: false,
                message: "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character."
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword
        });

        // Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password are required"
            });
        }

         // Validate email format
         if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Compare password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE } // Set the expiration time for the token (1 hour)
        );

        // Set JWT token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Ensures that the cookie cannot be accessed through JavaScript
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            maxAge: 3600000, // 1 hour (same as token expiration)
            sameSite: 'strict' // Ensures the cookie is sent only with requests from the same origin
        });

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Logout user
export const logoutUser = (req, res) => {
    try {
        // Clear the JWT token from cookies
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensures that cookie is cleared only over HTTPS in production
            sameSite: 'strict', // Ensures the cookie is cleared only from the same origin
        });

        // Send a response indicating the user has been logged out
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};