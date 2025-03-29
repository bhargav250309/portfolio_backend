import Project from "../models/project.models.js";
import upload from "../config/multer.config.js";  // Reusing Multer configuration
import fs from 'fs';

// Create Project Controller
export const createProject = async (req, res) => {
    // Use Multer middleware to handle file upload for projectImage
    upload.single('projectImage')(req, res, async (err) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message,
            });
        }

        // Extract fields from the request body
        const { title, description, stack, priviewLink, githubLink } = req.body;

        // Get the uploaded file path from Multer's req.file
        const projectImage = req.file ? req.file.path : null;
        const imageName = req.file ? req.file.filename : null;

        try {
            // Validate required fields
            if (!title || !description || !stack || !priviewLink || !githubLink) {
                return res.json({
                    success: false,
                    message: "All fields are required"
                });
            }

            // if project already exist

            const existingProject = await Project.findOne({ title });
            if (existingProject) {
                return res.json({
                    success: false,
                    message: "Project already exists"
                });
            }

            // Create the project in the database
            const project = await Project.create({
                projectImage: projectImage,  // Store the file path
                title,
                description,
                stack: stack.split(','),  // Assuming 'stack' is a comma-separated string
                priviewLink,
                githubLink,
                imageName: imageName
            });

            // Send success response
            return res.status(201).json({
                success: true,
                message: "Project created successfully",
                data: project
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
};

// update Projects Controller
export const updateProject = async (req, res) => {
    const { projectId } = req.params;

    // Use Multer middleware to handle file upload for projectImage
    upload.single('projectImage')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        const { title, description, stack, priviewLink, githubLink } = req.body;

        try {
            // Find the project by ID
            const project = await Project.findById(projectId);
            if (!project) {
                return res.json({
                    success: false,
                    message: "Project not found"
                });
            }

            const projectImage = req.file ? req.file.path : project.projectImage;
            const imageName = req.file ? req.file.filename : project.imageName;

            // Process the stack
            const stackArray = stack ? stack.split(',').map(item => item.trim()) : [];

            // Update the project's data
            if (title) {
                project.title = title;
            }
            if (description) {
                project.description = description;
            }
            if (stackArray) {
                project.stack = stackArray;
            }
            if (priviewLink) {
                project.priviewLink = priviewLink;
            }
            if (githubLink) {
                project.githubLink = githubLink;
            }

            const oldImagePath = project.imageName;

            // Check if image exists in the uploads folder
            if (projectImage && oldImagePath && fs.existsSync(`./src/uploads/${oldImagePath}`)) {
                fs.unlinkSync(`./src/uploads/${oldImagePath}`);
                project.projectImage = projectImage;
            } else if (projectImage) {
                project.projectImage = projectImage;

            }

            if (imageName) {
                project.imageName = imageName;
            }


            // Save the updated project
            await project.save();

            // Send success response
            return res.status(200).json({
                success: true,
                message: "Project updated successfully",
                data: project
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    });
};

// Delete Project Controller
export const deleteProject = async (req, res) => {
    const { projectId } = req.params;
    try {

        // Find the project by ID
        const project = await Project.findByIdAndDelete(projectId);
        if (!project) {
            return res.json({
                success: false,
                message: "Project not found"
            });
        }

        // Delete the associated project image file
        fs.unlinkSync(project.projectImage);

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// get project details
export const getProjectDetails = async (req, res) => {
    try {
        // Find all projects
        const projects = await Project.find();

        if (!projects || projects.length === 0) {
            return res.json({
                success: false,
                message: "No project found"
            });
        }

        const protocol = req.protocol; // 'http' or 'https'
        const host = req.get('host'); // e.g., 'localhost:5000'

        // Map over projects and add imageUrl to each project
        const projectsWithImage = projects.map((project) => {
            const imageUrl = `${protocol}://${host}/uploads/images/${project.imageName}`;
            return {
                ...project.toObject(),
                imageUrl,
            };
        });

        // Send success response with the modified projects
        return res.status(200).json({
            success: true,
            message: "Project details retrieved successfully",
            data: projectsWithImage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get project details by ID
export const getProjectById = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const protocol = req.protocol;
        const host = req.get('host');

        // Add the imageUrl to the project
        const imageUrl = `${protocol}://${host}/uploads/images/${project.imageName}`;


        return res.status(200).json({
            success: true,
            message: "Project details retrieved successfully",
            data: { ...project.toObject(), imageUrl },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
