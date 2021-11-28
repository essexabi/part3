const mongoose = require("mongoose");
const {model, Schema} = mongoose;



const noteSchema = new Schema({
    title: String,
    body: String,
    important: Boolean,
    date: Date
})

const Note = model('Note', noteSchema)

module.exports = Note;