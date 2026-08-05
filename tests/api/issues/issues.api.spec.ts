import { test, expect } from '../../fixtures/auth.fixture';

test.describe('GET /api/issues', () => {
    test('list all issues', async ({ request, token }) => {
        const response = await request.get('/api/issues', {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.issues.length).toBeGreaterThan(0);
        expect(body.issues[0]).toHaveProperty('id');
        expect(body.issues[0]).toHaveProperty('title');
        expect(body.issues[0]).toHaveProperty('status');
        expect(body.issues[0]).toHaveProperty('priority');
    });

    test('filter by status', async ({ request, token }) => {
        const response = await request.get('/api/issues?status=in_progress', {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.issues.length).toBeGreaterThan(0);
        
        body.issues.forEach((issue: any) => {
            expect(issue.status).toBe('in_progress');
        });
    });
});




//    console.log(response.status());
//    console.log(await response.json());