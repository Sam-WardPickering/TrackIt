import { test, expect } from '../../fixtures/auth.fixture';

test('GET /api/issues - list all issues', async ({ request, token }) => {
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

//    console.log(response.status());
//    console.log(await response.json());