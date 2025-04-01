// import upload from "../config/multer.config.js";
// import Stack from "../models/stack.models.js";
// import fs from 'fs';

// export const createStack = async (req, res) => {

//     // Use Multer middleware to handle file upload for stackImage
//     upload.single('stackImage')(req, res, async (err) => {
//         if (err) {
//             return res.json({
//                 success: false,
//                 message: err.message,
//             });
//         }

//         const { stackName } = req.body;
//         const stackImage = req.file ? req.file.path : null;  // If file is uploaded, get the path; otherwise null
//         const imageName = req.file ? req.file.filename : null;

//         try {
//             // Handle validation before handling file upload
//             if (!stackName) {
//                 return res.json({
//                     success: false,
//                     message: 'Stack name is required',
//                 });
//             }

//             // Check if stackName already exists in the database
//             const techName = await Stack.findOne({ stackName });
//             if (techName) {
//                 return res.json({
//                     success: false,
//                     message: 'Stack name already exists',
//                 });
//             }

//             // If file is required, ensure that stackImage is not null
//             if (!stackImage) {
//                 return res.json({
//                     success: false,
//                     message: 'Stack image is required',
//                 });
//             }


//             // Create the new stack entry in the database
//             const newStack = await Stack.create({
//                 stackName,
//                 stackImage,
//                 imageName: imageName
//             });

//             // Send success response
//             res.status(201).json({
//                 success: true,
//                 message: 'Stack created successfully',
//                 stack: newStack,
//             });

//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: "Internal Server Error"
//             });
//         }
//     });
// };


// export const updateStack = async (req, res) => {
//     const { stackId } = req.params;  // Assume the stack is identified by stackId

//     // Use Multer middleware to handle file upload for stackImage
//     upload.single('stackImage')(req, res, async (err) => {
//         if (err) {
//             return res.json({
//                 success: false,
//                 message: err.message,
//             });
//         }

//         const { stackName } = req.body;

//         try {
//             // Find the stack by stackId
//             const existingStack = await Stack.findById(stackId);
//             if (!existingStack) {
//                 return res.json({
//                     success: false,
//                     message: 'Stack not found',
//                 });
//             }

//             // If stackName is provided, check if it already exists
//             if (stackName && stackName !== existingStack.stackName) {
//                 const techName = await Stack.findOne({ stackName });
//                 if (techName) {
//                     return res.json({
//                         success: false,
//                         message: 'Stack name already exists',
//                     });
//                 }
//             }

//             const stackImage = req.file ? req.file.path : existingStack.stackImage;
//             const imageName = req.file ? req.file.filename : existingStack.imageName;


//             // Update stack fields (only update if provided)
//             if (stackName) {
//                 existingStack.stackName = stackName;
//             }

//             const oldImagePath = existingStack.imageName;

//             // Check if image exists in the uploads folder
//             if (stackImage && oldImagePath && fs.existsSync(`./src/uploads/${oldImagePath}`)) {
//                 fs.unlinkSync(`./src/uploads/${oldImagePath}`);
//                 existingStack.stackImage = stackImage;
//             } else if (stackImage) {
//                 existingStack.stackImage = stackImage;
//             }
            
//             if (imageName) {
//                 existingStack.imageName = imageName;
//             }


//             // Save the updated stack data
//             await existingStack.save();

//             // Send success response
//             res.status(200).json({
//                 success: true,
//                 message: 'Stack updated successfully',
//                 stack: existingStack,
//             });

//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: "Internal Server Error"
//             });
//         }
//     });
// };


// export const deleteStack = async (req, res) => {
//     const { stackId } = req.params;  // Get the stackId from the URL params

//     try {
//         // Find the stack by its ID
//         const stack = await Stack.findById(stackId);
//         if (!stack) {
//             return res.json({
//                 success: false,
//                 message: 'Stack not found',
//             });
//         }

//         // Delete the associated image file
//         const oldImagePath = stack.imageName;
//         fs.unlinkSync(`./src/uploads/${oldImagePath}`);

//         // Delete the stack from the database
//         await stack.deleteOne();

//         // Send success response
//         res.status(200).json({
//             success: true,
//             message: 'Stack deleted successfully',
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// };


// export const getStacks = async (req, res) => {
//     try {
//         // Fetch all stacks from the database
//         const stacks = await Stack.find();
//         if (!stacks || stacks.length === 0) {
//             return res.json({
//                 success: false,
//                 message: 'No stacks found',
//             });
//         }

//         const protocol = req.protocol; // 'http' or 'https'
//         const host = req.get('host'); // e.g., 'localhost:5000'

//         // Map over stack and add imageUrl to each project
//         const stackWithImage = stacks.map((stack) => {
//             const imageUrl = `${protocol}://${host}/uploads/images/${stack.imageName}`;
//             return {
//                 ...stack.toObject(),
//                 imageUrl,
//             };
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Stacks retrieved successfully',
//             data: stackWithImage,
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// }


// export const getStacksBYId = async (req, res) => {
//     const { stackId } = req.params;

//     try {
//         const stack = await Stack.findById(stackId);
//         if (!stack) {
//             return res.json({
//                 success: false,
//                 message: 'Stack not found',
//             });
//         }

//         const protocol = req.protocol; // 'http' or 'https'
//         const host = req.get('host'); // e.g., 'localhost:5000'
//         const imageUrl = `${protocol}://${host}/uploads/images/${stack.imageName}`;

//         res.status(200).json({
//             success: true,
//             message: 'Stack retrieved successfully',
//             data:
//             {
//                 ...stack.toObject(),
//                 imageUrl,
//             }
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// }



import { upload } from "../config/cloudinary.config.js";
import Stack from "../models/stack.models.js";
import { v2 as cloudinary } from "cloudinary";

// CREATE STACK
export const createStack = async (req, res) => {
    upload.single('stackImage')(req, res, async (err) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        const { stackName } = req.body;
        const stackImageUrl = req.file ? req.file.path : null;
        const imageName = req.file ? req.file.public_id : null;

        try {
            if (!stackName || !stackImageUrl) {
                return res.status(400).json({
                    success: false,
                    message: 'Stack name and image are required',
                });
            }

            const existingStack = await Stack.findOne({ stackName });
            if (existingStack) {
                return res.status(400).json({
                    success: false,
                    message: 'Stack name already exists',
                });
            }

            const newStack = await Stack.create({
                stackName,
                stackImage: stackImageUrl,
                imageName: imageName,
            });

            res.status(201).json({
                success: true,
                message: 'Stack created successfully',
                stack: newStack,
            });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    });
};

// UPDATE STACK
export const updateStack = async (req, res) => {
    const { stackId } = req.params;

    upload.single('stackImage')(req, res, async (err) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        const { stackName } = req.body;

        try {
            const stack = await Stack.findById(stackId);
            if (!stack) {
                return res.status(404).json({
                    success: false,
                    message: 'Stack not found',
                });
            }

            if (stackName && stackName !== stack.stackName) {
                const existingStack = await Stack.findOne({ stackName });
                if (existingStack) {
                    return res.status(400).json({
                        success: false,
                        message: 'Stack name already exists',
                    });
                }
                stack.stackName = stackName;
            }

            if (req.file) {
                const oldImageName = stack.imageName;

                // Delete old image from Cloudinary
                if (oldImageName) {
                    await cloudinary.uploader.destroy(oldImageName);
                }

                // Update with new image
                stack.stackImage = req.file.path;
                stack.imageName = req.file.public_id;
            }

            await stack.save();

            res.status(200).json({
                success: true,
                message: 'Stack updated successfully',
                stack,
            });
        } catch (error) {
            console.error("Database Error:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    });
};

// DELETE STACK
export const deleteStack = async (req, res) => {
    const { stackId } = req.params;

    try {
        const stack = await Stack.findById(stackId);
        if (!stack) {
            return res.status(404).json({
                success: false,
                message: 'Stack not found',
            });
        }

        // Delete image from Cloudinary
        if (stack.imageName) {
            await cloudinary.uploader.destroy(stack.imageName);
        }

        await stack.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Stack deleted successfully',
        });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// GET ALL STACKS
export const getStacks = async (req, res) => {
    try {
        const stacks = await Stack.find();
        if (!stacks.length) {
            return res.status(404).json({
                success: false,
                message: 'No stacks found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Stacks retrieved successfully',
            data: stacks,
        });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

// GET STACK BY ID
export const getStacksBYId = async (req, res) => {
    const { stackId } = req.params;

    try {
        const stack = await Stack.findById(stackId);
        if (!stack) {
            return res.status(404).json({
                success: false,
                message: 'Stack not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Stack retrieved successfully',
            data: stack,
        });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
