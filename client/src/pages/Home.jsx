import React from "react";
import { motion } from "framer-motion";
import { FaStethoscope, FaHospitalAlt, FaHistory, FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <FaStethoscope className="text-blue-600 dark:text-blue-400 text-5xl mb-4" />,
    title: "Symptom Diagnosis",
    desc: "Get AI-powered disease predictions from your symptoms instantly.",
  },
  {
    icon: <FaRobot className="text-green-600 dark:text-green-400 text-5xl mb-4" />,
    title: "AI Medical Insights",
    desc: "Receive easy-to-understand AI explanations for your condition.",
  },
  {
    icon: <FaHospitalAlt className="text-red-600 dark:text-red-400 text-5xl mb-4" />,
    title: "Nearby Hospitals",
    desc: "Locate top-rated doctors and hospitals near your area quickly.",
  },
  {
    icon: <FaHistory className="text-yellow-600 dark:text-yellow-400 text-5xl mb-4" />,
    title: "Consultation History",
    desc: "Review your health consultation records at any time.",
  },
];

const testimonials = [
  {
    name: "Aarav S.",
    feedback:
      "Smart Medical Assistant helped me diagnose my symptoms accurately. The AI explanation was super easy to understand.",
  },
  {
    name: "Meena K.",
    feedback:
      "I found the nearest hospital in seconds and booked my appointment. Super intuitive and helpful platform!",
  },
  {
    name: "Rohan T.",
    feedback:
      "Dark mode UI and smooth animations made the whole experience pleasant. Highly recommend!",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white px-6 md:px-16 py-16 space-y-24">

      {/* Hero Section */}
      <motion.div
        className="text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
          🩺 Smart Medical Assistant
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Instantly diagnose symptoms, get AI explanations, find nearby hospitals, 
          and track your health history—all in one platform.
        </p>
      </motion.div>

      {/* Features Section */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12">✨ Core Features</h2>
        <motion.div
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12">💬 What Our Users Say</h2>
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
              whileHover={{ scale: 1.03 }}
            >
              <p className="italic text-gray-700 dark:text-gray-300">“{item.feedback}”</p>
              <p className="mt-4 font-semibold text-right text-blue-600 dark:text-blue-400">— {item.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Call to Action */}
      <motion.div
        className="text-center mt-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-4">🚀 Ready to take control of your health?</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Start diagnosing symptoms and discovering hospitals with one click.
        </p>
        <Link
          to="/consultation"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Get Started
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
