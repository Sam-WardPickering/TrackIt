import { test, expect } from '../../fixtures/auth.fixture';

test.describe('GET /api/users/admin/stats', () => {
    test('admin can access stats', async ({ request, token }) => {
        const response = await request.get('/api/users/admin/stats', {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.total_users).toBeDefined();
        expect(body.admins).toBeDefined();
    });

    test('member cannot access stats', async ({ request }) => {
        // Log in as member
        const loginResponse = await request.post('/api/auth/login', {
            data: {
                email: 'member@trackit.test',
                password: 'Password123',
            },
        });

        const memberToken = (await loginResponse.json()).token;

        const response = await request.get('/api/users/admin/stats', {
            headers: { Authorization: `Bearer ${memberToken}` },
        });

        expect(response.status()).toBe(403);

        const body = await response.json();
        expect(body.error).toBe('Admin access required');
    });
});