const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db.js')
const { generateToken } = require("../utils/jwt.js");

const saltRounds = 10;

router.get('/signup', async (req,res)=>{
    const {email, username, password} = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields required" });
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try{
        
    } catch(err){
        
    }
});

module.exports = router