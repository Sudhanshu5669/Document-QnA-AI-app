const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "60m" }
    );
};

module.exports = { generateToken };