const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access Denied: No token provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access Denied: Requires Admin Role' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
