import { createMocks } from 'node-mocks-http';
import registerHandler from '../pages/api/register';
import loginHandler from '../pages/api/login';
import itemsHandler from '../pages/api/items/index';

// Mock the database and auth modules
jest.mock('../lib/db', () => ({
    run: jest.fn().mockResolvedValue({ id: 1 }),
    get: jest.fn().mockResolvedValue(null), // Default to not found for register check
    query: jest.fn().mockResolvedValue([]),
}));

jest.mock('../lib/auth', () => ({
    signToken: jest.fn().mockReturnValue('fake-token'),
    setAuthCookie: jest.fn(),
    verifyToken: jest.fn().mockReturnValue({ id: 1, role: 'student' }),
}));

// Re-import to get the mocked versions
const db = require('../lib/db');
const auth = require('../lib/auth');

describe('API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /api/register creates a new user', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: {
                name: 'Test User',
                studentClass: '10A',
                school: 'Test School',
                phone: '1234567890',
            },
        });

        await registerHandler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.user).toHaveProperty('id');
        expect(db.run).toHaveBeenCalled();
    });

    test('POST /api/login returns user and cookie', async () => {
        // Mock user found
        db.get.mockResolvedValueOnce({ id: 1, phone: '1234567890', role: 'student' });

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                phone: '1234567890',
            },
        });

        await loginHandler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.user.phone).toBe('1234567890');
        expect(auth.setAuthCookie).toHaveBeenCalled();
    });

    test('GET /api/items returns items list', async () => {
        db.query.mockResolvedValueOnce([{ id: 1, name: 'Book' }]); // Items
        db.query.mockResolvedValueOnce([{ total: 1 }]); // Count

        const { req, res } = createMocks({
            method: 'GET',
            query: { page: 1, perPage: 10 }
        });

        await itemsHandler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(Array.isArray(data.items)).toBe(true);
        expect(data.items).toHaveLength(1);
    });
});
