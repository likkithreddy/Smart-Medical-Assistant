import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Download, Trash2, Loader2 } from "lucide-react";

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
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const downloadHistoryItem = (item) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(item, null, 2));
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
    );

  // Pagination logic
  const startIdx = (page - 1) * itemsPerPage;
  const currentItems = history.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        Prediction History
      </h2>

      {history.length === 0 ? (
        <div className="text-center mt-16">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
            alt="No history"
            className="w-40 mx-auto mb-4 opacity-70"
          />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            No predictions found yet.
          </p>
        </div>
      ) : (
        <>
          {currentItems.map((entry) => (
            <div
              key={entry._id}
              className="border rounded-xl p-5 mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadHistoryItem(entry)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <Download size={16} /> Download
                  </button>
                  <button
                    onClick={() => deleteHistoryItem(entry._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>

              {/* Symptoms */}
              <div className="mb-3 text-gray-700 dark:text-gray-200 text-sm">
                <span className="font-semibold">Symptoms:</span>{" "}
                {entry.symptoms && entry.symptoms.length > 0
                  ? entry.symptoms.join(", ")
                  : "N/A"}
              </div>

              {/* Predictions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2 text-left">Disease</th>
                      <th className="p-2 text-left">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.predictions.map((pred, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-800"
                        }
                      >
                        <td className="p-2">{pred.disease}</td>
                        <td className="p-2 font-medium text-blue-600 dark:text-blue-400">
                          {(pred.probability * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-4 py-1 font-medium text-gray-700 dark:text-gray-200">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
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
