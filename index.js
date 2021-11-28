require('./mongo');

const express = require("express");
const app = express();

/* app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    if ('OPTIONS' === req.method) {
        res.status(200).send(); // For OPTIONS requests, a 200 response is sent immediately
    } else {
        next(); // Continues normal workflow
    }

});
 */
const cors = require("cors");
app.use(cors());

const Note = require('./models/Note')

app.use(express.json());



/*const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type':'application/json'});
    response.end(JSON.stringify(notes));
})*/

app.get("/", (request, response) => {
    response.send(`<h1>Hello World</h1>`);
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then( notes => {
        response.json(notes);
    })
});

app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find((note) => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter((note) => note.id !== id);
    response.status(204).end();
});

app.post("/api/notes", (request, response) => {
    const note = request.body;


    if(!note || !note.body) {

        return response.status(400).json({
            note: note.body,
            error:"Content is missing or does not exist."
        })
    }
    const ids = notes.map((note) => note.id);
    const maxId = Math.max(...ids);
    const newNote = {
        userId: 1,
        id: maxId + 1,
        title: note.title,
        body: note.body,
        important: typeof note.important !== undefined ? note.important : false,
        date: new Date().toISOString()
    };
    notes=[...notes, newNote]

    response.status(201).json(newNote);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
