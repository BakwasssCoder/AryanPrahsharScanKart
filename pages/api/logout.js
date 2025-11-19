import { clearAuthCookie } from '../../lib/auth';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: true, message: 'Method not allowed' });
    }

    clearAuthCookie(res);
    return res.status(200).json({ ok: true });
}
