import { Router } from "express";
import { getAllInfo } from "../controllers/frontend.controllers.js";
import { createContactInfo } from "../controllers/contact.controllers.js";


const router = Router();

// Define routes for user info operations
router.route('/getinfo').get(getAllInfo);
router.route('/create-contact-message').post(createContactInfo);

export default router;