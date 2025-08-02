import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const History = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/predict/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/predict/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const downloadHistoryItem = (item) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `prediction-${item._id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchHistory();
    }
  }, [isAuthenticated]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // Pagination logic
  const startIdx = (page - 1) * itemsPerPage;
  const currentItems = history.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Prediction History</h2>
      {history.length === 0 ? (
        <p>No predictions found.</p>
      ) : (
        <>
          {currentItems.map((entry) => (
            <div key={entry._id} className="border rounded-md p-4 mb-6 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Timestamp: {new Date(entry.createdAt).toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadHistoryItem(entry)}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => deleteHistoryItem(entry._id)}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-2 text-gray-700 text-sm">
                <strong>Symptoms:</strong>{" "}
                {entry.symptoms && entry.symptoms.length > 0
                  ? entry.symptoms.join(", ")
                  : "N/A"}
              </div>

              {/* Predictions Table */}
              <table className="w-full text-left border mt-2">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Disease</th>
                    <th className="p-2 border">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.predictions.map((pred, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border">{pred.disease}</td>
                      <td className="p-2 border">{(pred.probability * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-4 py-1 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
