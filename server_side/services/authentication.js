const JWT = require('jsonwebtoken');
require("dotenv").config();

const secret = process.env.SECRET_KEY;

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role : user.role,
    };
    const token = JWT.sign(payload, secret);
    return token;
}

function createTokenForOneHour(user) {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role : user.role,
    };
    const token = JWT.sign(payload, secret, { expiresIn: '1h' });
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    validateToken, createTokenForUser, createTokenForOneHour
}