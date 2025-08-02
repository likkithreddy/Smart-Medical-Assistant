import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getUserProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// backend/routes/userRoutes.js

router.get("/profile", protect, getUserProfile);




export default router;
