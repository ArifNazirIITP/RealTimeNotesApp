const express = require('express');
const router = express.Router();
const { createNote, getNoteDetails, deleteNote, updateNote, getNotesByOwner, addNoteFromPageTalk } = require("../controller/noteController");

router.post('/note', createNote);
router.get('/note/:id', getNoteDetails);
router.delete('/note/:id', deleteNote);
router.put('/note/:id', updateNote);
router.get('/get-notes/:id', getNotesByOwner);
router.post('/add-note', addNoteFromPageTalk);



module.exports = router;