// ./lib/routes/notes/notes.controller.js
const express = require('express')
const notesController = express.Router()
const Note = require('./note')
const uuidv4 = require('uuid/v4');

notesController
  .post('/', async (req, res, next) => {
	console.log(req.body);
	const id = uuidv4();
  const message = {
    id,
	title: req.body.title
  };
var s = new Note({
	id,
	title:req.body.title
});

    const note = await Note.create(s);

    res.status(200).send(note)
  })

notesController
  .put('/:id', async (req, res, next) => {
	  console.log(req.body);
    const note = await Note.findByIdAndUpdate(req.params.id, { $set: req.body }, { $upsert: true, new: true })
    res.status(200).send(note)
  })

notesController
  .get('/', async (req, res, next) => {
    const notes = await Note.find()
    res.status(200).send(notes)
  })

notesController
  .get('/:id', async (req, res, next) => {
    const note = await Note.findById(req.params.id)
    res.status(200).send(note)
  })

notesController
  .delete('/:id', async (req, res, next) => {
    const note = await Note.deleteOne({ _id: req.params.id })
    res.status(200).send(note)
  })

module.exports = notesController