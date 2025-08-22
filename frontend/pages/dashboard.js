import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../utils/firebase";
import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();

  // UI state
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);

  const [newText, setNewText] = useState("");
  const [notes, setNotes] = useState([]);
  const [shareEmail, setShareEmail] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showHistoryFor, setShowHistoryFor] = useState(null);

  // 1) Ensure user is logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/"); // back to login if not signed in
      } else {
        setUser(u);
      }
      setLoadingUser(false);
    });
    return () => unsub();
  }, [router]);

  // 2) Real-time notes (owner + sharedWith)
  useEffect(() => {
    if (!user) return;

    // Listener 1: notes owned by me
    const qOwned = query(
      collection(db, "notes"),
      where("owner", "==", user.uid)
    );
    const unsubOwned = onSnapshot(qOwned, (snap) => {
      setNotes((prev) => {
        const prevById = new Map(prev.map((n) => [n.id, n]));
        snap.docs.forEach((d) => prevById.set(d.id, { id: d.id, ...d.data() }));
        return Array.from(prevById.values());
      });
    });

    // Listener 2: notes shared WITH my email
    const qShared = query(
      collection(db, "notes"),
      where("sharedWith", "array-contains", user.email)
    );
    const unsubShared = onSnapshot(qShared, (snap) => {
      setNotes((prev) => {
        const prevById = new Map(prev.map((n) => [n.id, n]));
        snap.docs.forEach((d) => prevById.set(d.id, { id: d.id, ...d.data() }));
        return Array.from(prevById.values());
      });
    });

    return () => {
      unsubOwned();
      unsubShared();
    };
  }, [user]);

  // Sorted notes (latest updated first)
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      const ta = a.updatedAt?.seconds || a.createdAt?.seconds || 0;
      const tb = b.updatedAt?.seconds || b.createdAt?.seconds || 0;
      return tb - ta;
    });
  }, [notes]);

  // 3) Add a new note (owner = me)
  const handleAdd = async () => {
    if (!newText.trim() || !user) return;

    await addDoc(collection(db, "notes"), {
      text: newText.trim(),
      owner: user.uid,
      ownerEmail: user.email,
      sharedWith: [],            // collaborators (emails)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      history: []                // we’ll push snapshots on edit
    });

    setNewText("");
  };

  // 4) Begin editing a note
  const beginEdit = (note) => {
    setEditingId(note.id);
    setEditingText(note.text || "");
  };

  // 5) Save edit (also push previous version to history)
  const saveEdit = async () => {
    if (!editingId || !editingText.trim()) return;

    const ref = doc(db, "notes", editingId);

    // Get current doc to capture previous text for history
    const snap = await getDoc(ref);
    const current = snap.data();

    await updateDoc(ref, {
      text: editingText.trim(),
      updatedAt: serverTimestamp(),
      history: arrayUnion({
        text: current?.text ?? "",
        editedBy: user?.email ?? "unknown",
        editedAt: new Date().toISOString()
      })
    });

    setEditingId(null);
    setEditingText("");
  };

  // 6) Delete (only owner can delete)
  const handleDelete = async (note) => {
    if (!user) return;
    if (note.owner !== user.uid) {
      alert("Only the owner can delete this note.");
      return;
    }
    await deleteDoc(doc(db, "notes", note.id));
  };

  // 7) Share by email (adds to sharedWith)
  const handleShare = async (note) => {
    if (!user) return;
    if (note.owner !== user.uid) {
      alert("Only the owner can share this note.");
      return;
    }
    if (!shareEmail || !shareEmail.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    await updateDoc(doc(db, "notes", note.id), {
      sharedWith: arrayUnion(shareEmail.trim().toLowerCase())
    });
    setShareEmail("");
    alert(`Shared with ${shareEmail}`);
  };

  // 8) Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loadingUser) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1>RealtimeNotesApp — Dashboard</h1>
        <div>
          <span style={{ marginRight: 12 }}>{user?.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Create */}
      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3>Create a new note</h3>
        <textarea
          rows={3}
          style={{ width: "100%", padding: 8 }}
          placeholder="Write your note..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <div style={{ marginTop: 8 }}>
          <button onClick={handleAdd}>Add Note</button>
        </div>
      </div>

      {/* Notes list */}
      <h2 style={{ marginTop: 24 }}>Your & Shared Notes</h2>
      {sortedNotes.length === 0 && <p>No notes yet. Create one above!</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {sortedNotes.map((n) => {
          const iOwnIt = n.owner === user?.uid;
          const updated =
            n.updatedAt?.toDate?.().toLocaleString?.() ||
            n.createdAt?.toDate?.().toLocaleString?.() ||
            "";

          return (
            <div key={n.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    Owner: {n.ownerEmail || "Unknown"} {iOwnIt ? "(You)" : ""}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    Shared with: {n.sharedWith?.length ? n.sharedWith.join(", ") : "—"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>Last updated: {updated}</div>
                </div>

                {/* Share input (only owner can share) */}
                {iOwnIt && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="email"
                      placeholder="share user email"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                      style={{ padding: 6 }}
                    />
                    <button onClick={() => handleShare(n)}>Share</button>
                  </div>
                )}
              </div>

              {/* Text or Edit box */}
              <div style={{ marginTop: 10 }}>
                {editingId === n.id ? (
                  <>
                    <textarea
                      rows={3}
                      style={{ width: "100%", padding: 8 }}
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={() => { setEditingId(null); setEditingText(""); }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <div style={{ whiteSpace: "pre-wrap" }}>{n.text}</div>
                )}
              </div>

              {/* Actions */}
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                {editingId === n.id ? null : (
                  <button onClick={() => beginEdit(n)}>Edit</button>
                )}
                <button onClick={() => setShowHistoryFor(showHistoryFor === n.id ? null : n.id)}>
                  {showHistoryFor === n.id ? "Hide History" : "View History"}
                </button>
                <button
                  onClick={() => handleDelete(n)}
                  style={{ color: iOwnIt ? "red" : "#aaa", cursor: iOwnIt ? "pointer" : "not-allowed" }}
                  disabled={!iOwnIt}
                  title={iOwnIt ? "Delete note" : "Only owner can delete"}
                >
                  Delete
                </button>
              </div>

              {/* History */}
              {showHistoryFor === n.id && (
                <div style={{ marginTop: 10, background: "#fafafa", padding: 10, borderRadius: 6 }}>
                  <b>History</b>
                  {!n.history || n.history.length === 0 ? (
                    <div style={{ fontSize: 12, opacity: 0.7 }}>No previous versions.</div>
                  ) : (
                    <ul style={{ marginTop: 6 }}>
                      {[...n.history].reverse().slice(0, 5).map((h, idx) => (
                        <li key={idx} style={{ marginBottom: 6 }}>
                          <div style={{ fontSize: 12, opacity: 0.8 }}>
                            {h.editedBy} — {new Date(h.editedAt).toLocaleString()}
                          </div>
                          <div style={{ whiteSpace: "pre-wrap" }}>{h.text}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}