import { query, run } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import cookie from 'cookie';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { page = 1, perPage = 12, q, category, minPrice, maxPrice, condition } = req.query;
        const offset = (page - 1) * perPage;

        let sql = `
      SELECT items.*, users.name as seller_name, users.school as seller_school, users.student_class as seller_class, users.phone as seller_phone
      FROM items
      JOIN users ON items.seller_id = users.id
      WHERE items.status = 'active'
    `;
        const params = [];

        if (q) {
            sql += ` AND (items.name LIKE ? OR items.description LIKE ?)`;
            params.push(`%${q}%`, `%${q}%`);
        }
        if (category) {
            sql += ` AND items.category = ?`;
            params.push(category);
        }
        if (minPrice) {
            sql += ` AND items.price >= ?`;
            params.push(minPrice);
        }
        if (maxPrice) {
            sql += ` AND items.price <= ?`;
            params.push(maxPrice);
        }
        if (condition) {
            sql += ` AND items.condition = ?`;
            params.push(condition);
        }

        // Count total
        const countSql = `SELECT count(*) as total FROM (${sql})`; // Simple way to count filtered
        // Actually, better to replace SELECT ... with SELECT count(*)
        // But subquery is easier to construct here.

        sql += ` ORDER BY items.created_at DESC LIMIT ? OFFSET ?`;
        params.push(perPage, offset);

        try {
            const items = await query(sql, params);
            // For count, we need to run the query without limit/offset
            // This is a bit inefficient but fine for demo.
            // Or use a separate count query construction.

            // Re-construct count query
            let countQuery = `
        SELECT count(*) as total
        FROM items
        JOIN users ON items.seller_id = users.id
        WHERE items.status = 'active'
      `;
            const countParams = [];
            if (q) {
                countQuery += ` AND (items.name LIKE ? OR items.description LIKE ?)`;
                countParams.push(`%${q}%`, `%${q}%`);
            }
            if (category) {
                countQuery += ` AND items.category = ?`;
                countParams.push(category);
            }
            if (minPrice) {
                countQuery += ` AND items.price >= ?`;
                countParams.push(minPrice);
            }
            if (maxPrice) {
                countQuery += ` AND items.price <= ?`;
                countParams.push(maxPrice);
            }
            if (condition) {
                countQuery += ` AND items.condition = ?`;
                countParams.push(condition);
            }

            const countResult = await query(countQuery, countParams);
            const total = countResult[0]?.total || 0;

            return res.status(200).json({ items, total, page: parseInt(page), perPage: parseInt(perPage) });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }
    } else if (req.method === 'POST') {
        // Auth check
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.scankart_token;
        const user = verifyToken(token);

        if (!user) {
            console.log('Unauthorized item creation attempt');
            return res.status(401).json({ error: true, message: 'Unauthorized' });
        }

        const { name, description, price, condition, category, imageBase64, preferred_exchange_place } = req.body;
        console.log('Create item payload:', { name, price, category, hasImage: !!imageBase64 });

        // Validation
        if (!name || price < 0 || !category) {
            console.log('Invalid input for item creation');
            return res.status(400).json({ error: true, message: 'Invalid input' });
        }

        // Size limit check (approximate for base64)
        if (imageBase64 && imageBase64.length > 2 * 1024 * 1024) { // ~1.5MB limit
            console.log('Image too large');
            return res.status(400).json({ error: true, message: 'Image too large' });
        }

        const finalImage = imageBase64 || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

        try {
            const result = await run(
                `INSERT INTO items (name, description, price, condition, category, image_base64, seller_id, preferred_exchange_place)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, description, price, condition, category, finalImage, user.id, preferred_exchange_place]
            );
            console.log('Item created, ID:', result.id);

            return res.status(201).json({ id: result.id, message: 'Item created' });
        } catch (error) {
            console.error('Database error creating item:', error);
            return res.status(500).json({ error: true, message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ error: true, message: 'Method not allowed' });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb', // Allow larger body for base64 image
        },
    },
};
