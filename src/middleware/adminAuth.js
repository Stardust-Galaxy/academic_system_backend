// src/middleware/adminAuth.js
module.exports = (req, res, next) => {
    // Check if user has admin role
    if (req.userData.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied: Admin privileges required'
        });
    }
    next();
};