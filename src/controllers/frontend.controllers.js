import About from "../models/about.models.js";
import Links from "../models/links.models.js";
import Project from "../models/project.models.js";
import Stack from "../models/stack.models.js";
import UserInfo from "../models/userInfo.models.js";


export const getAllInfo = async (req, res) => {
    try {
        const userInfo = await UserInfo.find();
        const stackInfo = await Stack.find();
        const projectInfo = await Project.find();
        const aboutInfo = await About.find();
        const links = await Links.find();

        // Check if the data exists for each category
        if (!userInfo || userInfo.length === 0) {
            return res.json({
                success: false,
                message: 'No user information found',
            });
        }

        if (!stackInfo || stackInfo.length === 0) {
            return res.json({
                success: false,
                message: 'No stack information found',
            });
        }

        if (!projectInfo || projectInfo.length === 0) {
            return res.json({
                success: false,
                message: 'No project information found',
            });
        }

        if (!aboutInfo || aboutInfo.length === 0) {
            return res.json({
                success: false,
                message: 'No about information found',
            });
        }

        if (!links || links.length === 0) {
            return res.json({
                success: false,
                message: 'No links found',
            });
        }

        const protocol = req.protocol; // 'http' or 'https'
        const host = req.get('host'); // e.g., 'localhost:5000'

        // Process userInfo to add imageUrl
        const updatedUserInfo = userInfo.map(user => {
            return {
                ...user.toObject(),
                imageUrl: `${protocol}://${host}/uploads/images/${user.imageName}`
            };
        });

        // Process stackInfo to add a new field (if needed)
        const updatedStackInfo = stackInfo.map(stack => {
            return {
                ...stack.toObject(),
                imageUrl: `${protocol}://${host}/uploads/images/${stack.imageName}`
            };
        });

        // Process projectInfo to add a new field (if needed)
        const updatedProjectInfo = projectInfo.map(project => {
            return {
                ...project.toObject(),
                imageUrl: `${protocol}://${host}/uploads/images/${project.imageName}`
            };
        });

        // Process aboutInfo to add a new field (if needed)
        const updatedAboutInfo = aboutInfo.map(about => {
            return {
                ...about.toObject(),
                imageUrl: `${protocol}://${host}/uploads/images/${about.imageName}`
            };  
        });
        

        // Send all processed data back in the response
        res.status(200).json({
            success: true,
            message: 'Information retrieved successfully',
            data: {
                userInfo: updatedUserInfo,
                stackInfo: updatedStackInfo,
                projectInfo: updatedProjectInfo,
                aboutInfo: updatedAboutInfo,
                links: links
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
