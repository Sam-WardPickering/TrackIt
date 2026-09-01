import { test, expect } from '../../fixtures/auth.fixture';

const sqlInjectionPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "admin'--",
    "' UNION SELECT * FROM users--",
];

test.describe('POST /api/auth/login', () => {
    for (const payload of sqlInjectionPayloads) {
        test(`Email field - SQL injection: ${payload}`, async ({ request }) => {
            const response = await request.post('/api/auth/login', {
                data: {
                    email: payload,
                    password: 'Password123',
                }
            });

            expect(response.status()).toBe(400);

            const body = await response.json();
            expect(body.error).toBe('Validation failed');
            expect(body.details[0].message).toBe('Invalid email address');
        });

        test(`Password field - SQL injection: ${payload}`, async ({ request }) => {
            const response = await request.post('/api/auth/login', {
                data: {
                    email: 'admin@trackit.test',
                    password: payload,
                }
            });

            expect(response.status()).toBe(401);

            const body = await response.json();
            expect(body.error).toBe('Invalid credentials');
        });
    }

});

test.describe('GET /api/issues - filter injection', () => {
    for (const payload of sqlInjectionPayloads) {
        test(`Status filter - SQL injection: ${payload}`, async ({ request, token }) => {
            const response = await request.get(`/api/issues?sstatus=${encodeURIComponent(payload)}`, {
                headers: { Authorization: `Bearer: ${token}` },
            });

            expect(response.status()).toBe(401);

            const body = await response.json();
            expect(body.error).toBe('Missing or malformed Authorization header');
        });
    }
});