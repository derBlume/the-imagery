const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:patrick:postgres@localhost:5432/imageboard"
);

module.exports.getImages = function getImages() {
    return db.query("SELECT * FROM images");
};
