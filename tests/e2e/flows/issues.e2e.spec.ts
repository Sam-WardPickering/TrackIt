import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { IssuesPage } from '../pages/IssuesPage';
import { users } from '../../test-data/users';

test.describe('Issues', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(users.admin.email, users.admin.password);
        await expect(page).toHaveURL(/\/issues$/);
    })
});