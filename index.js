/////////////////REQUIRE DATABASE & .ENV//////////////////
require("dotenv").config();
require("./mongo");

const express = require("express");

//////////////////SENTRY IMPORT///////////////////////////
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const app = express();

/////////////////////SENTRY INIT//////////////////////////
Sentry.init({
    dsn: "https://ff36b7c6dc5f4d7bbb7cb9a91dd7df0f@o1083032.ingest.sentry.io/6092209",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

//////////////////MIDDLEWARE ERRORS IMPORT///////////////////////
const notFound = require("./middleware/notFound");
const handleError = require("./middleware/handleError");

//////////////////////CORS IMPORT//////////////////////////
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

const Contact = require("./models/Contact");

app.use(express.json());

/*const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type':'application/json'});
    response.end(JSON.stringify(notes));
})*/

/////////////////END-POINTS CONTROLLERS//////////////////
app.get("/", (request, response) => {
    response.send(`<h1>Hello World</h1>`);
});

/////////////////NOTES-END-POINTS CONTROLLERS//////////////////
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

/////////////////CONTACTS-END-POINTS CONTROLLERS//////////////////
app.get("/api/contacts", (request, response) => {
    Contact.find({}).then((contacts) => {
        response.json(
            contacts.map((contact) => {
                const { _id, __V, ...restOfContact } = contact.toObject();
                return {
                    id: _id,
                    ...restOfContact,
                };
            })
        );
    });
});

app.post("/api/contacts", (request, response) => {
    const contact = request.body;
    console.log(request.body);
    console.log(contact);
    if (!contact || !contact.number || !contact.name) {
        return response.status(400).json({
            contact: contact.body,
            error: "Content is missing or does not exist.",
        });
    }

    const newContact = new Contact({
        name: contact.name,
        number: contact.number,
    });

    newContact.save().then((savedContact) => {
        response.json(savedContact);
    });
});

app.get("/api/contacts/:id", (request, response, next) => {
    const { id } = request.params;
    Contact.findById(id)
        .then((contact) => {
            if (contact) {
                response.json(contact);
            } else {
                response.status(404).end();
            }
        })
        .catch((err) => next(err));
});

app.put("/api/contacts/:id", (request, response) => {
    const { id } = request.params;
    const contact = request.body;

    const newContactInfo = {
        name: contact.name,
        number: contact.number,
    };

    Contact.findByIdAndUpdate(id, newContactInfo, { new: true })
        .then((result) => {
            response.json(result);
        })
        .catch((err) => {
            next(err);
        });
});

app.delete("/api/contacts/:id", (request, response, next) => {
    const { id } = request.params;
    Contact.findByIdAndDelete(id)
        .then(() => {
            response.status(204);
        })
        .catch((err) => next(error));
});

/////////////////SENTRY ERROR HANDLERS////////////////////////
app.use(Sentry.Handlers.errorHandler());

//////////////////MIDDLEWARES/////////////////////////////
app.use(notFound);
app.use(handleError);

//////////////////SERVER CONNECTION///////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
