const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db.js')
const { generateToken } = require("../utils/jwt.js");

const saltRounds = 10;

router.post('/signup', async (req,res)=>{
    try{
    const {email, username, password} = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const existingUsers = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR username = $2",
        [email, username]
    )

    if(existingUsers.rows.length > 0){
        return res.status(400).json({message: "Username or email already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
        "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email",
        [email, username, hashedPassword]
    )
    
    const user = newUser.rows[0];

    const token = generateToken(user);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    res.status(201).json({
        message: "Signup successful"
    });
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        // Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            user: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

const verifyToken = require('../middlewares/authmiddleware.js');

router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router