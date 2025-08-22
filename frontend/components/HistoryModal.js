import React, { useEffect, useState } from "react";
import { getHistory, restoreHistory } from "../utils/noteService";

export default function HistoryModal({ noteId, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory(noteId, setHistory);
  }, [noteId]);

  const handleRestore = async (h) => {
    await restoreHistory(noteId, h);
    alert("✅ Note restored from history!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">🕓 Note History</h2>
        {history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          history.map((h, i) => (
            <div key={i} className="border p-2 mb-2">
              <p className="font-semibold">{h.title}</p>
              <p className="text-sm text-gray-600">{h.content.slice(0, 50)}...</p>
              <button
                onClick={() => handleRestore(h)}
                className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
              >
                🔄 Restore
              </button>
            </div>
          ))
        )}
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
          Close
        </button>
      </div>
    </div>
  );
}
