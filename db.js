const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:patrick:postgres@localhost:5432/imageboard"
);

module.exports.getImages = function getImages({ lastId, number }) {
    if (lastId) {
        return Promise.all([
            db.query(
                "SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT $2",
                [lastId, number]
            ),
            db.query("SELECT id FROM images ORDER BY id ASC LIMIT 1"),
        ]);
    } else {
        return Promise.all([
            db.query("SELECT * FROM images ORDER BY id DESC LIMIT $1", [
                number,
            ]),
            db.query("SELECT id FROM images ORDER BY id ASC LIMIT 1"),
        ]);
    }
};

module.exports.getImageById = function getImageById(id) {
    return Promise.all([
        db.query("SELECT * FROM images WHERE id = $1", [id]),
        db.query(
            "SELECT id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 1",
            [id]
        ),
        db.query(
            "SELECT id FROM images WHERE id > $1 ORDER BY id ASC LIMIT 1",
            [id]
        ),
    ]);
};

module.exports.addImage = function addImage({
    url,
    username,
    title,
    description,
}) {
    return db.query(
        "INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *",
        [url, username, title, description]
    );
};

module.exports.addComment = function addComment({ image_id, username, text }) {
    return db.query(
        "INSERT INTO comments (image_id, username, text) VALUES ($1, $2, $3) RETURNING *",
        [image_id, username, text]
    );
};

module.exports.getComments = function getComments(image_id) {
    return db.query(
        "SELECT * FROM comments WHERE image_id = $1 ORDER BY ID DESC",
        [image_id]
    );
};
