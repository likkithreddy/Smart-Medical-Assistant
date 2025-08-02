import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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
    const updatedSymptoms = [...symptoms];
    updatedSymptoms.splice(index, 1);
    setSymptoms(updatedSymptoms);
};

const handleClearAll = () => {
    setSymptoms([]);
};


    const handleSubmit = async () => {
    setLoading(true);
    try {
        const res = await axios.post(
            "http://127.0.0.1:5000/predict", // prediction route
            { symptoms },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const predictionResults = res.data;
        setResults(predictionResults);

        // ⬇️ Save to database (MongoDB)
        await axios.post(
            "http://localhost:5000/api/predict/save", // your own Express route
            {
                symptoms,
                predictions: predictionResults,
            },
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
        <div className="min-h-screen py-10 px-4 md:px-20 bg-white dark:bg-black text-gray-800 dark:text-white transition duration-300">
            <motion.h1
                className="text-4xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Smart Disease Predictor
            </motion.h1>

            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Enter symptom (e.g. fever)"
                    value={inputSymptom}
                    onChange={(e) => setInputSymptom(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                />
                <button
                    onClick={handleAddSymptom}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                    Add Symptom
                </button>
            </div>

            {symptoms.length > 0 && (
    <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-2">
            {symptoms.map((s, idx) => (
                <span
                    key={idx}
                    className="bg-indigo-100 dark:bg-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                    {s}
                    <button
                        onClick={() => handleRemoveSymptom(idx)}
                        className="text-red-500 font-bold hover:text-red-700"
                    >
                        ×
                    </button>
                </span>
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


            <div className="text-center mb-6">
                <button
                    onClick={handleSubmit}
                    disabled={symptoms.length === 0 || loading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                    {loading ? 'Analyzing...' : 'Predict Disease'}
                </button>
            </div>

            {results.length > 0 && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {results.map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-md"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-400">
                                {item.disease} ({(item.probability * 100).toFixed(2)}%)
                            </h3>
                            <p className="mb-2">{item.description}</p>
                            <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-400">
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
