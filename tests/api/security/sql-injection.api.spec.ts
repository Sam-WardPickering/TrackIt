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

            console.log(response.status());
            console.log(await response.json());
        });
    }
});