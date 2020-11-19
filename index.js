const express = require("express");

const db = require("./db.js");

const s3 = require("./middlewares/s3.js");
const uploader = require("./middlewares/uploader.js");

const app = express();

app.use(express.static("public"));

app.get("/images", (request, response) => {
    db.getImages().then((data) => {
        response.json(data.rows);
    });
});

app.get("/images/:id", (request, response) => {
    db.getImageById(request.params.id).then((data) => {
        response.json(data.rows[0]);
    });
});

app.post("/upload", uploader.single("file"), s3, (request, response) => {
    db.addImage(request.body).then((data) => {
        response.json(data.rows[0]);
    });
});

app.listen(8080, () => {
    console.log("ImageBoard listening on 8080...");
});
