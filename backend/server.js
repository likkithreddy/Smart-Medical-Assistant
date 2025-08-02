import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import PredictRouter from "./routes/predictRoutes.js";
import consultationRouter from './routes/consultationRoutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import geminiRouter from "./routes/geminiRoutes.js"

 // ✅ Import predict routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to DB
connectDB();

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', PredictRouter);
app.use("/api/consultations", consultationRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/gemini", geminiRouter); // ✅ Add this line

// ✅ Root
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
