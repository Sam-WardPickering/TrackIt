import { test, expect } from '@playwright/test';

test('POST /api/auth/register - valid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
        data: {
            email: 'newuser1@email.com',
            password: 'newuserpassword123',
            name: 'New User 1',
        },
    });

    console.log(response.status());
    console.log(await response.json());
});
