///////REQUIRE DATABASE & .ENV///////////
require("dotenv").config();
require("./mongo");
////////////////////////////////////////

const express = require("express");
const app = express();

/////////MIDDLEWARES IMPORT//////////////
const notFound = require("./middleware/notFound");
const handleError = require("./middleware/handleError");
////////////////////////////////////////

/////////////CORS IMPORT////////////////
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

const Note = require("./models/Note");
const { exists } = require("./models/Note");

app.use(express.json());

/*const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type':'application/json'});
    response.end(JSON.stringify(notes));
})*/
////////////////////////////////////////

/////////////////CRUD//////////////////
app.get("/", (request, response) => {
    response.send(`<h1>Hello World</h1>`);
});

app.get("/api/notes", (request, response) => {
    Note.find({}).then((notes) => {
        response.json(
            notes.map((note) => {
                const { _id, __v, ...restOfNote } = note.toObject();
                return {
                    id: _id,
                    ...restOfNote,
                };
            })
        );
    });
});

app.get("/api/notes/:id", (request, response, next) => {
    const { id } = request.params;
    Note.findById(id)
        .then((note) => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch((err) => next(err));
});

app.put("/api/notes/:id", (request, response, next) => {
    const { id } = request.params;
    const note = request.body;

    const newNoteInfo = {
        title: note.title,
        body: note.body,
        important: note.important,
    };

    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then((result) => {
            response.json(result);
        })
        .catch((err) => {
            next(err);
        });
});

app.delete("/api/notes/:id", (request, response, next) => {
    const { id } = request.params;
    Note.findByIdAndDelete(id)
        .then(() => {
            response.status(204);
            //console.log("La nota ha sido borrada");
        })
        .catch((err) => next(error));
});

app.post("/api/notes", (request, response) => {
    const note = request.body;

    if (!note || !note.body) {
        return response.status(400).json({
            note: note.body,
            error: "Content is missing or does not exist.",
        });
    }

    const newNote = new Note({
        title: note.title,
        body: note.body,
        important: typeof note.important !== undefined ? note.important : false,
        date: new Date().toISOString(),
    });

    newNote.save().then((savedNote) => {
        response.json(savedNote);
    });
});
////////////////////////////////////////

//////////MIDDLEWARES//////////////////
app.use(notFound);
app.use(handleError);
//////////////////////////////////////

//////////SERVER CONNECTION///////////
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
