const dotenv = require('dotenv')
const pool = require('../config/db.js')
dotenv.config();

const createUserTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    username varchar(20) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `

    try {
        await pool.query(queryText);
        console.log("Users table created");
    } catch (err) {
        console.error("Error creating users table:", err);
    }
}

const createFilesTable = async () => {
    const queryText = `
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
    `

    try {
        await pool.query(queryText);
        console.log("Files table created");
    } catch (err) {
        console.error("Error creating files table:", err);
    }
}

const init = async () => {
    await createUserTable();
    await createFilesTable();
    process.exit();
};

init();