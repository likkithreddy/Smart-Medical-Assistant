import express from "express";
import { bookConsultation, getConsultations } from "../controllers/consultationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const consultationRouter = express.Router();

consultationRouter.post("/", protect, bookConsultation);       // Book a consultation
consultationRouter.get("/", protect, getConsultations);        // Fetch user's consultations

export default consultationRouter;
