const http = require("http");
const express = require("express");
const cors = require("cors");
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
app.use(cors());
app.use(express.json());



let notes = [
    {
        userId: 1,
        id: 1,
        title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
        date: "2019-05-30T17:30:31.098Z",
        important: true,
    },
    {
        userId: 1,
        id: 2,
        title: "qui est esse",
        body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
        date: "2019-05-30T18:39:34.091Z",
        important: false,
    },
    {
        userId: 1,
        id: 3,
        title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
        body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
        date: "2019-05-30T19:20:14.298Z",
        important: true,
    },
];

/*const app = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type':'application/json'});
    response.end(JSON.stringify(notes));
})*/

app.get("/", (request, response) => {
    response.send(`<h1>Hello World</h1>`);
});

app.get("/api/notes", (request, response) => {
    response.json(notes);
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
