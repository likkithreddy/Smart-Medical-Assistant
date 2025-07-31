import React from 'react';
import { motion } from 'framer-motion';
import { FaStethoscope, FaHospitalAlt, FaHistory, FaRobot } from 'react-icons/fa';
import { MdDarkMode } from 'react-icons/md';
import { Link } from 'react-router-dom';
const features = [
  {
    icon: <FaStethoscope className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />,
    title: "Symptom Diagnosis",
    desc: "Get AI-powered disease predictions from your symptoms instantly.",
  },
  {
    icon: <FaRobot className="text-green-600 dark:text-green-400 text-4xl mb-4" />,
    title: "AI Medical Insights",
    desc: "Receive easy-to-understand AI explanations for your condition.",
  },
  {
    icon: <FaHospitalAlt className="text-red-600 dark:text-red-400 text-4xl mb-4" />,
    title: "Nearby Hospitals",
    desc: "Locate top-rated doctors and hospitals near your area quickly.",
  },
  {
    icon: <FaHistory className="text-yellow-600 dark:text-yellow-400 text-4xl mb-4" />,
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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 md:px-16 py-10 space-y-20">

      {/* Hero Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          🩺 Smart Medical Assistant
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Instantly diagnose symptoms, get AI explanations, find nearby hospitals, and track your health history—all in one platform.
        </p>
      </motion.div>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Core Features</h2>
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
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-md hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
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
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.03 }}
            >
              <p className="italic">“{item.feedback}”</p>
              <p className="mt-4 font-semibold text-right">— {item.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Call to Action */}
      <motion.div
        className="text-center mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
        <p className="mb-6">Start diagnosing symptoms and discovering hospitals with one click.</p>
        <Link to="/consultation" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Get Started</Link>
        
      </motion.div>
    </div>
  );
};

export default Home;
