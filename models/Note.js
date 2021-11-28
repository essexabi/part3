const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const Note = model('Note', noteSchema)

const noteSchema = new Schema({
    title: String,
    body: String,
    important: Boolean,
    date: Date
})

module.exports = Note;