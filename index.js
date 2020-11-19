const express = require("express");

const db = require("./db.js");

const s3 = require("./middlewares/s3.js");
const uploader = require("./middlewares/uploader.js");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/images", (request, response) => {
    db.getImages(request.query.lastId).then((data) => {
        response.json({ images: data[0].rows, lastImageInDB: data[1].rows[0] });
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

app.get("/comments/:id", (request, response) => {
    db.getComments(request.params.id).then((data) => {
        response.json(data.rows);
    });
});

app.post("/comment", (request, response) => {
    console.log(request.body);
    db.addComment(request.body).then((data) => {
        response.json(data.rows[0]);
    });
});

app.listen(8080, () => {
    console.log("ImageBoard listening on 8080...");
});
