const { Schema, model, deleteModel } = require("mongoose");




const contactSchema = new Schema({
    name: String,
    number: String
   
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id =returnedObject._id;
        delete returnedObject.__v
        delete returnedObject._id;
    }
}) 

const Contact = model('Contact', contactSchema)

module.exports = Contact;