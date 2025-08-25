// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to authenticate and authorize users based on JWT.
 * @param {string['admin']} requiredRoles - An array of role names that are allowed to access the route.
 */
const authMiddleware = (requiredRoles) => (req, res, next) => {
    // Check for the Authorization header
    // console.log(req.user)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('Auth Middleware: No Authorization header provided.');
        return res.status(401).json({ message: 'No token provided' });
    }

    // Split the header to get the token part
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Auth Middleware: Token format is invalid.');
        return res.status(401).json({ message: 'Token format is invalid' });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded; // Store the user payload on the request object

        // Check if the user's role is allowed
        if (requiredRoles.length < 0 || !requiredRoles.includes(req.user.user_role)) {
            
            console.log(`Auth Middleware: Access denied for role: ${req.user.user_role}`);
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }

        // If everything is valid, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Auth Middleware: Token verification failed:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
