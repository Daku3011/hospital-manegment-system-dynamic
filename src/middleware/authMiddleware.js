const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            req.user = decoded;

            if (roles.length > 0 && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }

            next();
        } catch (ex) {
            res.status(400).json({ message: 'Invalid token.' });
        }
    };
};

module.exports = authMiddleware;
