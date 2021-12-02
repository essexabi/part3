const mongoose = require("mongoose");

const connectionString = process.env.MONGO_DB_URI;

mongoose
    .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to essexdb!");
    })
    .catch((err) => {
        console.error(err);
    });
