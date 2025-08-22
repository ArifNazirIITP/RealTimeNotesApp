import React, { useState } from "react";
import { saveNote, shareNote } from "../utils/noteService";
import HistoryModal from "./HistoryModal";

export default function NoteEditor({ note, user, goBack }) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [showHistory, setShowHistory] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  const handleSave = async () => {
    await saveNote(user.uid, { ...note, title, content });
    alert("✅ Note saved with history!");
    goBack();
  };

  const handleShare = async () => {
    if (!shareEmail) return;
    await shareNote(note.id, shareEmail);
    alert("📤 Shared with " + shareEmail);
    setShareEmail("");
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">✍️ Edit Note</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border w-full p-2 mb-2"
        placeholder="Note Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border w-full p-2 mb-2"
        rows="6"
        placeholder="Write something..."
      />
      <div className="flex gap-2">
        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
          💾 Save
        </button>
        <button onClick={() => setShowHistory(true)} className="bg-gray-500 text-white px-4 py-2 rounded">
          🕓 View History
        </button>
        <button onClick={goBack} className="bg-red-500 text-white px-4 py-2 rounded">
          🔙 Back
        </button>
      </div>

      <div className="mt-4">
        <input
          value={shareEmail}
          onChange={(e) => setShareEmail(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter email to share"
        />
        <button onClick={handleShare} className="bg-blue-500 text-white px-4 py-2 rounded">
          📤 Share
        </button>
      </div>

      {showHistory && (
        <HistoryModal noteId={note.id} onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}
