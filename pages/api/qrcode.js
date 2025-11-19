import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: true, message: 'Method not allowed' });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const publicDir = path.join(process.cwd(), 'public');
    const filePath = path.join(publicDir, 'scankart_qr.png');

    try {
        // Generate QR
        await QRCode.toFile(filePath, baseUrl, {
            color: {
                dark: '#0F172A', // Navy
                light: '#FFFFFF',
            },
            width: 400
        });

        // Read and return
        const img = fs.readFileSync(filePath);
        res.setHeader('Content-Type', 'image/png');
        res.send(img);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Failed to generate QR' });
    }
}
