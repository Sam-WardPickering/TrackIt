import { test, expect } from '@playwright/test';

test('POST /api/auth/register - valid credentials', async ({ request }) => {
    const userData = {
        email: `testuser-${Date.now()}@test.com`,
        password: 'newuserpassword123',
        name: 'New User 1',
    };

    const response = await request.post('/api/auth/register', { data: userData });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe(userData.email);
    expect(body.user.name).toBe(userData.name);
    expect(body.user.role).toBe('member');
});
