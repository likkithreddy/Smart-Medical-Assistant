import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
        prev.map((a) =>
          a._id === editingId ? { ...a, ...formData } : a
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!profile) return <div className="text-center mt-6">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-white">My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role || "User"}</p>

      <hr className="my-6 border-gray-300 dark:border-gray-600" />

      <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">My Appointments</h3>
      {appointments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="p-4 border rounded dark:border-gray-700">
              {editingId === appointment._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                  <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">Update</button>
                  <button onClick={() => setEditingId(null)} className="ml-2 px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
                </div>
              ) : (
                <>
                  <p><strong>Hospital:</strong> {appointment.hospitalName}</p>
                  <p><strong>Address:</strong> {appointment.address}</p>
                  <p><strong>Patient:</strong> {appointment.patientName}</p>
                  <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <button onClick={() => handleEdit(appointment)} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(appointment._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
