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

    test('filter by priority', async ({ request, token }) => {
        const response = await request.get('/api/issues?priority=high', {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.issues.length).toBeGreaterThan(0);
        
        body.issues.forEach((issue: any) => {
            expect(issue.priority).toBe('high');
        });
    });

    test('no auth token', async ({ request }) => {
        const response = await request.get('/api/issues?priority=high', {
            headers: {},
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.error).toBe('Missing or malformed Authorization header');
    });
});

test.describe('GET /api/issues/:id', () => {

    test('valid id returns correct issue', async ({ request, token }) => {
        // Get all issues
        const allIssuesResponse = await request.get('/api/issues', {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(allIssuesResponse.status()).toBe(200);

        const issue = (await allIssuesResponse.json()).issues[0];

        // Get issue by id
        const response = await request.get(`/api/issues/${issue.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.issue).toEqual(issue);
    });

    test('no id returns 404', async ({ request, token }) => {
        const response = await request.get('/api/issues/abc', {
            headers: { Authorization: `Bearer ${token}` },
        });

        expect(response.status()).toBe(404);
        
        const body = await response.json();
        expect(body.error).toEqual('Issue not found');
    });
});

test.describe('POST /api/issues', () => {

    test('create issue (happy path)', async ({ request, token }) => {
        const validIssue = {
            title: `new issue - ${Date.now()}`,
            description: 'new issue description',
            priority: 'low',
            assignee_id: 1
        };
        const response = await request.post('/api/issues', {
            headers: { Authorization: `Bearer ${token}` },
            data: validIssue,
        });

        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.issue.title).toBe(validIssue.title);
        expect(body.issue.description).toBe(validIssue.description);
        expect(body.issue.priority).toBe(validIssue.priority);
        expect(body.issue.assignee_id).toBe(validIssue.assignee_id);
    });
});

test.describe('PATCH /api/issues/:id', () => {
    test('legal status transition', async ({ request, token }) => {
        //create issue
        const createResponse = await request.post('/api/issues', {
            headers: { Authorization: `Bearer ${token}` },
            data: { title: 'Patch Test Issue' },
        });

        const issue = (await createResponse.json()).issue;

        // Change issue status to in_progress
        const patchResponse = await request.patch(`/api/issues/${issue.id}` , {
            headers: { Authorization: `Bearer ${token}` },
            data: { status: 'in_progress' },
        });

        expect(patchResponse.status()).toBe(200);

        const body = await patchResponse.json();
        expect(body.issue.status).toBe('in_progress');
    });

     test('illegal status transition', async ({ request, token }) => {
        //create issue
        const createResponse = await request.post('/api/issues', {
            headers: { Authorization: `Bearer ${token}` },
            data: { title: 'Patch Test Issue' },
        });

        const issue = (await createResponse.json()).issue;

        expect(issue.status).toBe('open');

        // Change issue status to in_progress
        const patchResponse = await request.patch(`/api/issues/${issue.id}` , {
            headers: { Authorization: `Bearer ${token}` },
            data: { status: 'resolved' },
        });

        expect(patchResponse.status()).toBe(422);

        const body = await patchResponse.json();
        expect(body.error).toBe("Cannot transition from 'open' to 'resolved'");
    });
});