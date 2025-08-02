import express from "express";
import HospitalAppointment from "../models/HospitalAppointment.js";
import {protect} from "../middlewares/authMiddleware.js"; // adjust to your project

const appointmentRouter = express.Router();

// Book an appointment
appointmentRouter.post("/", protect, async (req, res) => {
  try {
    const { patientName,hospitalName, reason, date, time } = req.body;
    const newAppointment = new HospitalAppointment({
      userId: req.user._id,
      hospitalName,
      patientName,
      reason,
      date,
      time,
    });
    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked!", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all appointments for a user
appointmentRouter.get("/", protect, async (req, res) => {
  try {
    const appointments = await HospitalAppointment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching appointments", error: err.message });
  }
});

appointmentRouter.put("/update/:id", protect, async (req, res) => {
  try {
    // console.log(req.params.id);

    const appointment = await HospitalAppointment.findById(req.params.id);
    // console.log(appointment);
    
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const updated = await HospitalAppointment.findByIdAndUpdate(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment" });
  }
});

// Delete appointment
appointmentRouter.delete("/delete/:id", protect, async (req, res) => {
  try {
    // console.log(req.params.id);
    
    const appointment = await HospitalAppointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await HospitalAppointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete appointment" });
  }
});

export default appointmentRouter;
