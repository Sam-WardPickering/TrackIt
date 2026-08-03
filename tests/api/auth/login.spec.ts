import { test, expect } from '@playwright/test';

test('POST /api/auth/login - valid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
        data: {
            email: 'admin@trackit.test',
            password: 'Password123', 
        },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.token).toBeDefined();
    expect(body.user.role).toBe('admin');
});


test('POST /api/auth/login - invalid email', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
        data: {
            email: 'invalid.admin@trackit.test',
            password: 'Password123', 
        },
    });

    expect(response.status()).toBe(401);
    
    const body = await response.json();
    expect(body.error).toBe('Invalid credentials');
});