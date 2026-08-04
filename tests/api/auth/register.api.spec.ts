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

test('POST /api/auth/register - duplicate email', async ({ request }) => {
    const userData = {
        email: 'admin@trackit.test',
        password: 'Password123',
        name: 'Duplicate',
    };

    const response = await request.post('/api/auth/register', { data: userData });

    expect(response.status()).toBe(409);

    const body = await response.json();
    expect(body.error).toBe('Email already registered');
});

test('POST /api/auth/register - invalid email format', async ({ request }) => {
    const userData = {
        email: `testuser-${Date.now()}`,
        password: 'Password123',
        name: 'Invalid Email',
    };

    const response = await request.post('/api/auth/register', { data: userData });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe('Validation failed');
    expect(body.details[0].field).toBe('email');
    expect(body.details[0].message).toBe('Invalid email address');
});

    // console.log(response.status());
    // console.log(await response.json());