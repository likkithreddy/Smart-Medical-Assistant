import Prediction from "../models/Prediction.js";

// Save prediction
export const savePrediction = async (req, res) => {
  try {
    const { symptoms, predictions } = req.body;

    const newPrediction = new Prediction({
      user: req.user.id,
      symptoms,
      predictions,
    });

    await newPrediction.save();
    res.status(201).json({ message: "Prediction saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get prediction history
export const getPredictionHistory = async (req, res) => {
  try {
    const history = await Prediction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
