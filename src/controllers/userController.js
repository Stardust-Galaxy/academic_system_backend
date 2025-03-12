const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/config');

exports.register = async (req, res, next) => {
    try {
        const { user_name, password, user_type } = req.body;

        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE user_name = ?', [user_name]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const [result] = await db.query(
            'INSERT INTO users (user_name, password, user_type) VALUES (?, ?, ?)',
            [user_name, hashedPassword, user_type || 'student']
        );

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};
exports.login = async (req, res, next) => {
    try {
        const { user_name, password, user_type } = req.body;
        // Find user
        const [users] = await db.query('SELECT * FROM users WHERE user_name = ?', [user_name]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            console.log('Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if(user.user_type !== user_type){
            return res.status(401).json({ message: 'Wrong user type!' });
        }
        // Generate JWT
        const token = jwt.sign(
            { id: user.user_id, role: user.user_type },
            config.jwtSecret,
            { expiresIn: config.jwtExpiration }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.user_name,
                role: user.user_type
            }
        });
    } catch (error) {
        next(error);
    }
};