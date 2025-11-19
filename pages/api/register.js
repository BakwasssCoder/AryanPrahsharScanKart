import { run, get } from '../../lib/db';
import { signToken, setAuthCookie } from '../../lib/auth';

export default async function handler(req, res) {
    console.log('API /api/register hit', req.method);
    if (req.method !== 'POST') {
        return res.status(405).json({ error: true, message: 'Method not allowed' });
    }

    const { name, studentClass, school, phone } = req.body;
    console.log('Register payload:', { name, studentClass, school, phone });

    if (!name || !studentClass || !school || !phone) {
        console.log('Missing fields');
        return res.status(400).json({ error: true, message: 'Missing required fields' });
    }

    try {
        // Check if user exists
        const existing = await get('SELECT id FROM users WHERE phone = ?', [phone]);
        if (existing) {
            console.log('User already exists');
            return res.status(400).json({ error: true, message: 'Phone number already registered' });
        }

        // Create user
        const role = name.toLowerCase() === 'aryan prashar' ? 'admin' : 'student';
        const result = await run(
            'INSERT INTO users (name, student_class, school, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, studentClass, school, phone, role]
        );
        console.log('User inserted, ID:', result.id, 'Role:', role);

        const user = { id: result.id, name, student_class: studentClass, school, phone, role };
        const token = signToken(user);
        setAuthCookie(res, token);
        console.log('Cookie set, returning success');

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: true, message: 'Internal server error' });
    }
}
