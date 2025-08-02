// backend/routes/geminiRoutes.js
import express from "express";
import { handleGeminiChat } from "../controllers/geminiController.js";

const geminiRouter = express.Router();

geminiRouter.post("/chat", handleGeminiChat);

export default geminiRouter;
