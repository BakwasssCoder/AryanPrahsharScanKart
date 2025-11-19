import { get, run } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import cookie from 'cookie';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const item = await get(
                `SELECT items.*, users.name as seller_name, users.school as seller_school, users.student_class as seller_class, users.phone as seller_phone
         FROM items
         JOIN users ON items.seller_id = users.id
         WHERE items.id = ?`,
                [id]
            );

            if (!item) {
                return res.status(404).json({ error: true, message: 'Item not found' });
            }

            return res.status(200).json(item);
        } catch (error) {
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }
    } else if (req.method === 'DELETE') {
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.scankart_token;
        const user = verifyToken(token);

        if (!user) {
            return res.status(401).json({ error: true, message: 'Unauthorized' });
        }

        try {
            const item = await get('SELECT seller_id FROM items WHERE id = ?', [id]);
            if (!item) {
                return res.status(404).json({ error: true, message: 'Item not found' });
            }

            if (item.seller_id !== user.id && user.role !== 'admin') {
                return res.status(403).json({ error: true, message: 'Forbidden' });
            }

            await run('DELETE FROM items WHERE id = ?', [id]);

            // Log admin action if admin
            if (user.role === 'admin' && item.seller_id !== user.id) {
                await run('INSERT INTO admin_actions (admin_id, item_id, action, reason) VALUES (?, ?, ?, ?)',
                    [user.id, id, 'delete', 'Admin removed item']);
            }

            return res.status(200).json({ message: 'Item deleted' });
        } catch (error) {
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ error: true, message: 'Method not allowed' });
    }
}
