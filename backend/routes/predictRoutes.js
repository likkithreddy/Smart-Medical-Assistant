import express from "express";
import { savePrediction, getPredictionHistory } from "../controllers/predictController.js";
import {protect} from "../middlewares/authMiddleware.js";
import Prediction from "../models/Prediction.js";

const PredictRouter = express.Router();

// @route   POST /api/predict
// @desc    Save a prediction
// @access  Private
PredictRouter.post("/save", protect, savePrediction);

// @route   GET /api/predict/history
// @desc    Get all predictions for logged-in user
// @access  Private
PredictRouter.get("/history", protect, getPredictionHistory);

PredictRouter.delete("/history/:id", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const predictionId = req.params.id;

    const prediction = await Prediction.findOne({ _id: predictionId, user: userId });

    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    await prediction.deleteOne();
    res.json({ message: "Prediction deleted successfully" });
  } catch (error) {
    console.error("Delete prediction error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



export default PredictRouter;
