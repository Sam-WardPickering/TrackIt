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


test('POST /api/auth/login - invalid password', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
        data: {
            email: 'admin@trackit.test',
            password: 'password1234', 
        },
    });

    expect(response.status()).toBe(401);
    
    const body = await response.json();
    expect(body.error).toBe('Invalid credentials');
});


test('POST /api/auth/login - missing credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
        data: {},
    });

    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body.details[0].field).toBe('email');
    expect(body.details[0].message).toBe('Required');
    expect(body.details[1].field).toBe('password');
    expect(body.details[1].message).toBe('Required');
});


test('POST /api/auth/login - invalid email format', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
        data: {
            email: 'notanemail',
            password: 'Password123', 
        },
    });

    expect(response.status()).toBe(400);
    
    const body = await response.json();
    expect(body.error).toBe('Validation failed');
    expect(body.details[0].field).toBe('email');
    expect(body.details[0].message).toBe('Invalid email address');
});


