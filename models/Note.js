const { Schema, model, deleteModel } = require("mongoose");




const noteSchema = new Schema({
    title: String,
    body: String,
    important: Boolean,
    date: Date
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id =returnedObject._id;
        delete returnedObject.__v
        delete returnedObject._id;
    }
}) 

const Note = model('Note', noteSchema)

module.exports = Note;