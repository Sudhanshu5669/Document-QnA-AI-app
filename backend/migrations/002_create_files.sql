CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);