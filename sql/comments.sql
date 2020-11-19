DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    image_id INTEGER NOT NULL REFERENCES images(id),
    text VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)