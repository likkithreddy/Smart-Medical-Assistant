import Consultation from "../models/consultationModel.js";

export const bookConsultation = async (req, res) => {
  try {
    const { date, time, symptoms } = req.body;

    if (!date || !time || !symptoms) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const consultation = new Consultation({
      user: req.user._id,
      date,
      time,
      symptoms,
    });

    await consultation.save();

    res.status(201).json({ message: "Consultation booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
