import { Router } from "express";
import { deleteUserInfo, getUserInfo, updateUserInfo, userInfo } from "../controllers/userInfo.controllers.js";
import { createProject, deleteProject, getProjectById, getProjectDetails, updateProject } from "../controllers/project.controllers.js";
import { createAboutUser, deleteAboutUser, getAboutUser, updateAboutUser } from "../controllers/about.controllers.js";
import { createStack, deleteStack, getStacks, getStacksBYId, updateStack } from "../controllers/stack.controllers.js";
import { deleteContactInfo, getAllContactInfo } from "../controllers/contact.controllers.js";
import { createLinks, deleteLinks, getLinks, updateLinks } from "../controllers/links.controllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Define routes for user info operations
router.route('/create-userinfo').post(userInfo);
router.route('/update-userinfo/:userId').put(updateUserInfo);
router.route('/delete-userinfo/:userId').delete(deleteUserInfo);
router.route('/get-userinfo').get(authMiddleware,getUserInfo);

// define stack routes
router.route('/create-stack').post(createStack);
router.route('/update-stack/:stackId').put(updateStack);
router.route('/delete-stack/:stackId').delete(deleteStack);
router.route('/get-aastack').get(authMiddleware,getStacks);
router.route('/get-stack/:stackId').get(authMiddleware,getStacksBYId);

// define routes for project info operations
router.route('/create-project').post(createProject);
router.route('/update-project/:projectId').put(updateProject);
router.route('/delete-project/:projectId').delete(deleteProject);
router.route('/get-project/').get(authMiddleware,getProjectDetails);
router.route('/get-projectbyid/:projectId').get(authMiddleware,getProjectById);

// define about user
router.route('/create-aboutUser').post(createAboutUser);
router.route('/update-aboutUser/:aboutUserId').put(updateAboutUser);
router.route('/delete-aboutUser/:aboutUserId').delete(deleteAboutUser);
router.route('/get-aboutUser').get(authMiddleware,getAboutUser);

// contact routes
router.route('/get-contact-message').get(authMiddleware,getAllContactInfo);
router.route('/delete-contact-message/:contactId').delete(deleteContactInfo);

// links routes
router.route('/create-link').post(createLinks);
router.route('/update-link/:linkId').put(updateLinks);
router.route('/delete-link/:linkId').delete(deleteLinks);
router.route('/get-links').get(authMiddleware,getLinks);

export default router;