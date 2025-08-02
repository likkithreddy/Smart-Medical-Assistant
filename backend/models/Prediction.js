import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: [String],
    predictions: [
      {
        disease: String,
        probability: Number,
        description: String,
        precautions: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model("Prediction", predictionSchema);
export default Prediction;
