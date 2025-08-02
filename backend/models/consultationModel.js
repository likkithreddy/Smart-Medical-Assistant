import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  age: Number,
  gender: String,
  symptoms: String,
  preferredDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Consultation", consultationSchema);
