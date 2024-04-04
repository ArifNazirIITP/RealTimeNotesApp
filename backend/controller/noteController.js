const Note = require('../models/note');
const { ObjectId } = require('mongodb');


const createNote = async (req, res) =>
{
  try
  {
    const { docId, title, content, uid, category, tags } = req.body;
    if (!title || !content)
    {
      return res.status(400).json({ message: 'Title, content, and owner are required' });
    }

    const newNote = new Note({
      docId,
      uid,
      title,
      content,
      category,
      tags: tags || [],
      timestamp: Date.now()
    });

    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (error)
  {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
};

const getNoteDetails = async (req, res) =>
{
  try
  {
    const { id: noteId } = req.params;



    const note = await Note.find({ "docId": `${noteId}` });

    if (!note)
    {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error)
  {
    console.error('Error fetching note details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const deleteNote = async (req, res) =>
{
  try
  {
    const noteId = req.params.id;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote)
    {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error)
  {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateNote = async (req, res) =>
{
  try
  {
    const noteId = req.params.id;
    const { title, content, category, tags } = req.body;

    const existingNote = await Note.findOneAndUpdate({ "docId": noteId }, {
      title: title,
      content: content,
      category: category,
      tags: tags,
      timestamp: Date.now()
    });

    if (!existingNote)
    {
      return res.status(404).json({ message: 'Note not found' });
    }
    // Update note data
    // Save the updated note
    const updatedNote = await existingNote.save();

    res.status(201).json(updatedNote);
  } catch (error)
  {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getNotesByOwner = async (req, res) =>
{
  try
  {
    const id = req.params.id;
    const notes = await Note.find({ "uid": id.toString() });

    res.json(notes);
  } catch (error)
  {
    console.error('Error fetching notes by owner:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addNoteFromPageTalk = async (req, res) =>
{
  try
  {
    const { content, user_id } = req.body;
    if (!user_id || !content)
    {
      return res.status(400).json({ message: 'Title, user_id, and owner are required' });
    }

    const docId = Math.floor(Math.random() * 10000000);
    const newNote = new Note({
      docId: docId.toString(),
      uid: user_id,
      title: 'New Note',
      content: content,
      category: 'frontend',
      tags: ['tag'],
      timestamp: Date.now()
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      message: 'created a new note',
      url: `https://impetus-notes-sync.vercel.app/pagetalk/${docId}`
    
    });
  } catch (error)
  {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
};



module.exports = {
  createNote,
  getNoteDetails,
  deleteNote,
  updateNote,
  getNotesByOwner,
  addNoteFromPageTalk
};