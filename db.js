const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:patrick:postgres@localhost:5432/imageboard"
);

module.exports.getImages = function getImages() {
    return db.query("SELECT * FROM images");
};

module.exports.getImageById = function getImageById(id) {
    return db.query("SELECT * FROM images WHERE id = $1", [id]);
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
