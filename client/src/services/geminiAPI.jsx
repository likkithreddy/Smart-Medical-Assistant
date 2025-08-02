// src/services/geminiAPI.js
import axios from "axios";

const GEMINI_BACKEND_URL = "http://localhost:5000/api/gemini/chat";

export const getAIResponse = async (prompt) => {
  const res = await axios.post(GEMINI_BACKEND_URL, { prompt });
  return res.data.reply;
};
