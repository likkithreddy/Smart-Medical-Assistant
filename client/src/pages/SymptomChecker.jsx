import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Loader2 } from "lucide-react";

const SymptomChecker = () => {
    const [inputSymptom, setInputSymptom] = useState('');
    const [symptoms, setSymptoms] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAddSymptom = () => {
        if (inputSymptom.trim() && !symptoms.includes(inputSymptom.trim().toLowerCase())) {
            setSymptoms([...symptoms, inputSymptom.trim().toLowerCase()]);
            setInputSymptom('');
        }
    };

    const handleRemoveSymptom = (index) => {
        setSymptoms(symptoms.filter((_, i) => i !== index));
    };

    const handleClearAll = () => setSymptoms([]);

    const handleSubmit = async () => {
        if (symptoms.length === 0) return;
        setLoading(true);
        try {
            const res = await axios.post(
                "http://127.0.0.1:5000/predict",
                { symptoms },
                { headers: { "Content-Type": "application/json" } }
            );

            const predictionResults = res.data;
            setResults(predictionResults);

            // Save to MongoDB
            await axios.post(
                "http://localhost:5000/api/predict/save",
                { symptoms, predictions: predictionResults },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
        } catch (error) {
            console.error("Error fetching/saving predictions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 md:px-20 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-black dark:to-gray-800 text-gray-800 dark:text-white transition duration-300">
            
            {/* Title */}
            <motion.h1
                className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                🧠 Smart Disease Predictor
            </motion.h1>

            {/* Input Section */}
            <motion.div 
                className="flex flex-col md:flex-row items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <input
                    type="text"
                    placeholder="Enter a symptom (e.g. fever)"
                    value={inputSymptom}
                    onChange={(e) => setInputSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSymptom()}
                    className="flex-1 px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
                <button
                    onClick={handleAddSymptom}
                    className="px-5 py-3 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
                >
                    <PlusCircle size={18}/> Add
                </button>
            </motion.div>

            {/* Symptom Pills */}
            {symptoms.length > 0 && (
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {symptoms.map((s, idx) => (
                            <motion.span
                                key={idx}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-indigo-100 dark:bg-indigo-700 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-sm"
                            >
                                {s}
                                <button
                                    onClick={() => handleRemoveSymptom(idx)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={14}/>
                                </button>
                            </motion.span>
                        ))}
                    </div>
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-red-600 hover:underline"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Predict Button */}
            <div className="text-center mb-8">
                <button
                    onClick={handleSubmit}
                    disabled={symptoms.length === 0 || loading}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={18}/> Analyzing...
                        </span>
                    ) : "🔍 Predict Disease"}
                </button>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {results.map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-400">
                                {item.disease} <span className="text-sm font-normal">({(item.probability * 100).toFixed(2)}%)</span>
                            </h3>
                            <p className="mb-3 text-gray-600 dark:text-gray-300">{item.description}</p>
                            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">Precautions:</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {item.precautions.map((precaution, i) => (
                                    <li key={i}>{precaution}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default SymptomChecker;
