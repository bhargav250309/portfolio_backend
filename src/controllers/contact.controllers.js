import ContactMessage from "../models/contact.models.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD // Your Gmail App Password
    }
});

export const createContactInfo = async (req, res) => {
    const { contactName, contactEmail, contactMessage } = req.body;

    try {
        // Validate input fields
        if (!contactName || !contactEmail || !contactMessage) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate input lengths
        if (contactName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be less than 100 characters"
            });
        }

        if (contactMessage.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Message must be less than 1000 characters"
            });
        }

        // Email regex validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Save contact message to database
        const createContact = await ContactMessage.create({
            contactName: contactName.trim(),
            contactEmail: contactEmail.trim(),
            contactMessage: contactMessage.trim()
        });

        // Email notification configuration
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Sending to yourself
            subject: 'New Contact Form Submission',
            html: `
                <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      padding: 20px;
      color: #333;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      max-width: 600px;
      margin: auto;
    }
    h2 {
      color: #2c3e50;
    }
    p {
      line-height: 1.6;
    }
    .label {
      font-weight: bold;
    }
    .footer {
      font-size: 12px;
      color: #888;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>📩 New Contact Message</h2>
    <p><span class="label">Name:</span>  ${contactName}</p>
    <p><span class="label">Email:</span>  ${contactEmail}</p>
    <p><span class="label">Message:</span></p>
    <p>${contactMessage}</p>
    <hr>
    <p><span class="label">Submitted:</span> ${new Date().toLocaleString()}</p>
    <div class="footer">
      You received this message through your portfolio contact form.
    </div>
  </div>
</body>
</html>

            `
        };

        // Send email notification
        await transporter.sendMail(mailOptions);

        // Success response
        res.status(201).json({
            success: true,
            message: "Contact form submitted successfully",
            data: createContact
        });

    } catch (error) {
        console.error('Error in createContactInfo:', error);

        // Specific error handling
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                error: error.message
            });
        }

        if (error.code === 'EAUTH') {
            return res.status(500).json({
                success: false,
                message: "Email authentication failed"
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// get all contact form submissions
export const getAllContactInfo = async (req, res) => {
    try {
        const contact = await ContactMessage.find();
        if (!contact) {
            return res.json({
                success: false,
                message: "No contact information found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact information fetched successfully",
            data: contact
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// delete contact form submission by id
export const deleteContactInfo = async (req, res) => {
    const { contactId } = req.params
    try {
        const contact = await ContactMessage.findById(contactId);
        if (!contact) {
            return res.json({
                success: false,
                message: "Contact information not found"
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: "Contact information deleted successfully",
            data: contact
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}