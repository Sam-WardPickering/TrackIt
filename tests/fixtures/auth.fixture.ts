import { test as base } from '@playwright/test';

interface AuthFixtures {
    token: string;
}

export const test = base.extend<AuthFixtures>({
    token: async ({ request }, use) => {
        const response = await request.post('/api/auth/login', {
        data: {
            email: 'admin@trackit.test',
            password: 'Password123',
        },
    });

    const body = await response.json();
    await use(body.token);
  },
});

export { expect } from '@playwright/test';