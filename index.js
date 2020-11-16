const express = require("express");

const db = require("./db.js");

const app = express();

app.use(express.static("public"));

app.get("/images", (request, response) => {
    db.getImages().then((data) => {
        response.json(data.rows);
        console.log(data.rows);
    });
});

app.listen(8080, () => {
    console.log("ImageBoard listening...");
});
