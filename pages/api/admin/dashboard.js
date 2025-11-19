import { query } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import cookie from 'cookie';

export default async function handler(req, res) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.scankart_token;
    const user = verifyToken(token);

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: true, message: 'Forbidden' });
    }

    try {
        const totalItems = await query('SELECT count(*) as count FROM items');
        const totalUsers = await query('SELECT count(*) as count FROM users');
        const recentItems = await query('SELECT * FROM items ORDER BY created_at DESC LIMIT 5');

        return res.status(200).json({
            stats: {
                items: totalItems[0].count,
                users: totalUsers[0].count,
            },
            recentItems
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }
}
