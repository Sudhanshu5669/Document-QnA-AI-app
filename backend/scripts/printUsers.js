const dotenv = require('dotenv')
const pool = require('../config/db.js')
dotenv.config();

const showUsers = async () => {
    const queryText = `
    SELECT * FROM users;
    `

    try {
        const ans = await pool.query(queryText);
        console.log(ans);
    } catch (err) {
        console.error("Error creating users table:", err);
    }
}

showUsers();