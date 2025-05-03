const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
// middlewares/auth.js
// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Access token required' });

//   jwt.verify(token, 'your_jwt_secret', (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });

//     req.user = user; // Store decoded user info (e.g., id)
//     next();
//   });
// };

// module.exports = authenticateToken;

