// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
    return (req, res, next) => {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ message: "Access denied. No token provided." });

        const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
        if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // { id: user._id, role: user.role }

            // Check allowed roles if roles array is provided
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access denied. Unauthorized role." });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = auth;
