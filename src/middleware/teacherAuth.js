// src/middleware/teacherAuth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const teacherAuth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        if (decoded.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied' });
        }
        req.userData = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = teacherAuth;