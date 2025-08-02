// frontend/src/pages/Nearby.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const Nearby = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Allow location to see nearby hospitals");
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      axios
        .get(
          `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${location.lon},${location.lat},5000&limit=10&apiKey=6a80ac3824a84c388606fd0aa4b4ccde`
        )
        .then((res) => {
          setHospitals(res.data.features);
        })
        .catch((err) => console.error("Geoapify error:", err));
    }
  }, [location]);

  const handleBookAppointment = (hospital) => {
    setSelectedHospital(hospital);
  };

  const submitAppointment = async () => {
  if (!patientName || !appointmentDate || !selectedHospital) {
    alert("Please fill all details");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const appointmentData = {
      hospitalName: selectedHospital.properties.name || "Unnamed Hospital",
      address: selectedHospital.properties.address_line1 || "No address",
      patientName,
      date: appointmentDate,
    };

    const res = await axios.post(
      "http://localhost:5000/api/appointments",
      appointmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Appointment booked successfully!");
  } catch (err) {
    console.error("Booking failed:", err.response?.data || err.message);
    alert("Failed to book appointment.");
  } finally {
    setSelectedHospital(null);
    setPatientName("");
    setAppointmentDate("");
  }
};


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Hospitals</h1>

      {location ? (
        <>
          <MapContainer
            center={[location.lat, location.lon]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="mb-6"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />
            <Marker position={[location.lat, location.lon]}>
              <Popup>You are here</Popup>
            </Marker>

            {hospitals.map((hospital, i) => (
              <Marker
                key={i}
                position={[
                  hospital.geometry.coordinates[1],
                  hospital.geometry.coordinates[0],
                ]}
              >
                <Popup>
                  <strong>{hospital.properties.name}</strong>
                  <br />
                  {hospital.properties.address_line1}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Hospital List */}
          <div className="grid gap-4">
            {hospitals.map((hospital, index) => (
              <div
                key={index}
                className="border p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{hospital.properties.name || "Unnamed Hospital"}</h2>
                  <p>{hospital.properties.address_line1}</p>
                </div>
                <button
                  className="mt-2 sm:mt-0 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => handleBookAppointment(hospital)}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>

          {/* Appointment Modal */}
          {selectedHospital && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4">
                  Book Appointment at <br />
                  <span className="text-blue-700">{selectedHospital.properties.name}</span>
                </h2>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full border p-2 mb-3 rounded"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
                <input
                  type="date"
                  className="w-full border p-2 mb-3 rounded"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
                <div className="flex justify-between">
                  <button
                    className="bg-gray-400 px-3 py-1 rounded text-white"
                    onClick={() => setSelectedHospital(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-600 px-3 py-1 rounded text-white"
                    onClick={submitAppointment}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Getting location...</p>
      )}
    </div>
  );
};

export default Nearby;
