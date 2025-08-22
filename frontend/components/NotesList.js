import React, { useEffect, useState } from "react";
import { getNotes } from "../utils/noteService"; // tumne jo banaya tha
import NoteEditor from "./NoteEditor";

export default function NotesList({ user }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    if (user) {
      getNotes(user.uid, setNotes); // realtime notes fetch
    }
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📒 My Notes</h1>
      {!selectedNote ? (
        <div>
          <button
            onClick={() =>
              setSelectedNote({ title: "", content: "", id: null })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            ➕ New Note
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="p-4 bg-white shadow rounded cursor-pointer"
              >
                <h2 className="font-semibold">{note.title}</h2>
                <p className="text-sm text-gray-600">
                  {note.content.slice(0, 50)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoteEditor note={selectedNote} user={user} goBack={() => setSelectedNote(null)} />
      )}
    </div>
  );
}
