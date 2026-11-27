import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { IssuesPage } from '../pages/IssuesPage';
import { uniqueEmail } from '../../helpers/users';

test.describe('Register', () => {
    test('New user can register and lands on the issues list', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const issuesPage = new IssuesPage(page);
        const newUserEmail = uniqueEmail('register');

        await registerPage.goto();
        await registerPage.register('John', newUserEmail, 'Password123');

        await expect(page).toHaveURL(/\/issues$/);
        await expect(issuesPage.issuesList).toBeVisible();
    });
});

