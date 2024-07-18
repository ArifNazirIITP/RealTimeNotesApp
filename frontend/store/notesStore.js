import { create } from "zustand";
import { persist } from "zustand/middleware";


const notesStore = persist(
    set => ({
        notes: [],
        category: null,
        setNotes: (notes) => set({ notes }),
        setCategory: (category) => set({ category }),
    }), {
    name: "notes-store",
    getStorage: () => localStorage,
})

const useNotesStore = create(notesStore);

export default useNotesStore;