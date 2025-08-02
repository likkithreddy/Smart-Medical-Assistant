import mongoose from "mongoose";

const hospitalAppointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or whatever user model is
    required: true,
  },

  patientName: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  reason: String,
  date: String,
  time: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("HospitalAppointment", hospitalAppointmentSchema);
