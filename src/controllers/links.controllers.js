import Links from "../models/links.models.js";


export const createLinks = async (req, res) => {

    const { github, linkedin, instagram, facebook, whatsapp, email } = req.body;

    try {
        if (!linkedin || !instagram || !facebook || !github || !whatsapp || !email) {
            return res.json({
                success: false,
                message: 'All fields are required'
            });
        }
       
        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if user already has links
        const existingLinks = await Links.findOne({ email });
        if (existingLinks) {
            await Links.deleteOne({ _id: existingLinks._id})
        }

        // Save links to the database
        const newLinks = await Links.create({
            github,
            linkedin,
            instagram,
            facebook,
            whatsapp,
            email,
        });

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Links created successfully',
            data: newLinks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Update links
export const updateLinks = async (req, res) => {
    const { linkId } = req.params;
    const { github, linkedin, instagram, facebook, whatsapp, email } = req.body;
    console.log("github",req.body)
    try {
        
        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: 'Invalid email format'
            });
        }
        // Find user
        const user = await Links.findById(linkId);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found',
            });
        }
        // Update links
        if(github){
            user.github = github;
        }
        if(linkedin){
            user.linkedin = linkedin;
        }
        if(instagram){
            user.instagram = instagram;
        }
        if(facebook){
            user.facebook = facebook;
        }
        if(whatsapp){
            user.whatsapp = whatsapp;
        }
        if(email){
            user.email = email;
        }
        
        await user.save();
        console.log(user.github)
        // Return success response
        res.status(200).json({
            success: true,
            message: 'Links updated successfully',
            data: user,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        });
    }
}

// Delete links
export const deleteLinks = async (req, res) => {
    const { linkId } = req.params;

    try {
        // Find user
        const user = await Links.findByIdAndDelete(linkId);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found',
            });
        }
        // Return success response
        res.status(200).json({
            success: true,
            message: 'Links deleted successfully',
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Get links
export const getLinks = async (req, res) => {
    try {
        const links = await Links.findOne();

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Links retrieved successfully',
            data: links,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}