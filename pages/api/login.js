import { get } from '../../lib/db';
import { signToken, setAuthCookie } from '../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: true, message: 'Method not allowed' });
    }

    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: true, message: 'Phone number required' });
    }

    try {
        const user = await get('SELECT * FROM users WHERE phone = ?', [phone]);

        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        const token = signToken(user);
        setAuthCookie(res, token);

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }
}
