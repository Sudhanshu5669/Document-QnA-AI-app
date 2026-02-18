const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db.js')

const saltRounds = 10;

router.get('/signup', async (req,res)=>{
    const {email, username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try{
        
    } catch(err){
        
    }
});

module.exports = router