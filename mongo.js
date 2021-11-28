const mongoose = require("mongoose");

const connectionString = "mongodb+srv://xabi:Angula30@cluster0.reyqd.mongodb.net/essexdb?retryWrites=true&w=majority";

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
