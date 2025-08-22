import { useEffect, useState } from "react";
import { addNote, updateNote } from "../utils/noteService";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function NotesApp({ currentUser }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");

  const fetchNotes = async () => {
    const querySnapshot = await getDocs(collection(db, "notes"));
    const notesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotes(notesList);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    await addNote(newNote, currentUser.uid);
    setNewNote("");
    fetchNotes();
  };

  const handleUpdateNote = async () => {
    if (!selectedNote) return alert("Select a note to update");
    await updateNote(selectedNote.id, updatedContent, currentUser.uid);
    setUpdatedContent("");
    setSelectedNote(null);
    fetchNotes();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📝 Notes App</h1>

      {/* ✅ Add Note Section */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Add New Note</h2>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write your note here..."
          rows="3"
          style={{ width: "300px" }}
        />
        <br />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      {/* ✅ Notes List */}
      <div style={{ marginBottom: "20px" }}>
        <h2>All Notes</h2>
        <ul>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: "10px" }}>
              <b>{note.content}</b>
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => setSelectedNote(note)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Update Section */}
      {selectedNote && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Edit Note</h2>
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            placeholder="Update your note..."
            rows="3"
            style={{ width: "300px" }}
          />
          <br />
          <button onClick={handleUpdateNote}>Update Note</button>
        </div>
      )}
    </div>
  );
}
