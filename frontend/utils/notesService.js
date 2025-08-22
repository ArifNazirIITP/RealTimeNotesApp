// frontend/src/utils/notesService.js
import { db } from "./firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

/** 1) Naya note add */
export const addNote = async (note) => {
  try {
    await addDoc(collection(db, "notes"), {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("✅ Note added!");
  } catch (e) {
    console.error("❌ Error adding note: ", e);
  }
};

/** 2) Apne notes real-time me laao */
export const getMyNotes = (userId, callback) => {
  const q = query(collection(db, "notes"), where("owner", "==", userId));
  return onSnapshot(q, (qs) => {
    const notes = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(notes);
  });
};

/** 3) Note update + history entry add */
export const updateNote = async (noteId, { title, content }, user) => {
  const noteRef = doc(db, "notes", noteId);

  // jo field aayi sirf wohi update karenge
  const patch = { updatedAt: serverTimestamp() };
  if (typeof title === "string") patch.title = title;
  if (typeof content === "string") patch.content = content;

  // note update
  await updateDoc(noteRef, patch);

  // history me version add
  await addDoc(collection(db, "notes", noteId, "history"), {
    ...(typeof title === "string" ? { title } : {}),
    ...(typeof content === "string" ? { content } : {}),
    editedAt: serverTimestamp(),
    editedBy: user?.uid || "unknown",
  });
};

/** 4) Kisi note ki history real-time me laao (latest first) */
export const listenHistory = (noteId, callback) => {
  const histRef = collection(db, "notes", noteId, "history");
  const q = query(histRef, orderBy("editedAt", "desc"));
  return onSnapshot(q, (qs) => {
    const history = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(history);
  });
};

/** 5) History version se note restore (bas updateNote hi call hota hai) */
export const restoreVersion = async (noteId, version, user) => {
  await updateNote(
    noteId,
    { title: version?.title, content: version?.content },
    user
  );
};
