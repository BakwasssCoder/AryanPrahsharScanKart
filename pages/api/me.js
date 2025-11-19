import { verifyToken } from '../../lib/auth';
import { get } from '../../lib/db';
import cookie from 'cookie';

export default async function handler(req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.scankart_token;

    if (!token) {
        return res.status(401).json({ error: true, message: 'Not authenticated' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: true, message: 'Invalid token' });
    }

    try {
        const user = await get('SELECT id, name, student_class, school, phone, role FROM users WHERE id = ?', [decoded.id]);
        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }
}
