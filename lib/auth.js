const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

const signToken = (user) => {
    return jwt.sign(
        { id: user.id, phone: user.phone, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
};

const setAuthCookie = (res, token) => {
    const serialized = cookie.serialize('scankart_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
    res.setHeader('Set-Cookie', serialized);
};

const clearAuthCookie = (res) => {
    const serialized = cookie.serialize('scankart_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: -1,
        path: '/',
    });
    res.setHeader('Set-Cookie', serialized);
};

const authMiddleware = (handler) => {
    return async (req, res) => {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.scankart_token;

        if (!token) {
            return res.status(401).json({ error: true, message: 'Unauthorized' });
        }

        const user = verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: true, message: 'Invalid token' });
        }

        req.user = user;
        return handler(req, res);
    };
};

module.exports = { signToken, verifyToken, setAuthCookie, clearAuthCookie, authMiddleware };
