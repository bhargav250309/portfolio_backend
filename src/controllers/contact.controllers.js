import ContactMessage from "../models/contact.models.js";


// create contact form
export const createContactInfo = async (req, res) => {
    const { contactName, contactEmail, contactMessage } = req.body;
    console.log(contactName, contactEmail, contactMessage)

    try {
        if (!contactName && !contactEmail && !contactMessage) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        // email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            return res.json({
                success: false,
                message: "Invalid email format"
            });
        }

        const createContact = await ContactMessage.create({
            contactName,
            contactEmail,
            contactMessage
        });

        res.status(200).json({
            success: true,
            message: "submitted successfully",
            data: createContact
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}

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