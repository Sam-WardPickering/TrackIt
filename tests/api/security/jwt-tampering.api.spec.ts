import { test, expect } from '../../fixtures/auth.fixture';

test.describe('JWT tampering', () => {
    test('rejects a tampered token', async ({ request, token }) => {
        // Take the valid token and change the last character
        const tamperedToken = token.slice(0, -1) + 'X';

        const response = await request.get('/api/issues', {
            headers: { Authorization: `Bearer ${tamperedToken}` },
        });

        expect(response.status()).toBe(401);
    });

    test('rejects a empty string as token', async ({ request }) => {
        const response = await request.get('/api/issues', {
            headers: { Authorization: 'Bearer ' },
        });

        expect(response.status()).toBe(401);
    });

    test('rejected a token without Bearer prefix', async ({ request, token }) => {
        const response = await request.get('/api/issues', {
            headers: { Authorization: token },
        });

        expect(response.status()).toBe(401);
    });
});