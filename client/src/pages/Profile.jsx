import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, Trash2, User, Mail, Calendar, Home } from "lucide-react";

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    hospitalName: "",
    address: "",
    patientName: "",
    date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [profileRes, appointmentsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:5000/api/appointments", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setProfile(profileRes.data);
        setAppointments(appointmentsRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
        navigate("/login");
      }
    };

    if (isAuthenticated) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleEdit = (appointment) => {
    setEditingId(appointment._id);
    setFormData({
      hospitalName: appointment.hospitalName,
      address: appointment.address,
      patientName: appointment.patientName,
      date: appointment.date.split("T")[0],
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/appointments/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointments/update/${editingId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === editingId ? { ...a, ...formData } : a))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!profile)
    return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      {/* Profile Card */}
      <motion.div
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          My Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <p className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" /> {profile.name}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-500" /> {profile.email}
          </p>
          <p className="flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-500" /> {profile.role || "User"}
          </p>
        </div>
      </motion.div>

      {/* Appointments Section */}
      <motion.div
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">
          My Appointments
        </h3>

        {appointments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No appointments found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {appointments.map((appointment) => (
              <motion.div
                key={appointment._id}
                className="p-5 border rounded-xl shadow-sm dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                whileHover={{ scale: 1.02 }}
              >
                {editingId === appointment._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.hospitalName}
                      onChange={(e) =>
                        setFormData({ ...formData, hospitalName: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) =>
                        setFormData({ ...formData, patientName: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-lg text-indigo-600">
                      {appointment.hospitalName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.address}
                    </p>
                    <p className="mt-2">
                      <strong>Patient:</strong> {appointment.patientName}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-red-500" />{" "}
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
