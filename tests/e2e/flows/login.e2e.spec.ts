import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../../test-data/users';

test.describe('Login', () => {
    test('Admin can log in and see the issues list', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.login(users.admin.email, users.admin.password);

        await expect(page).toHaveURL(/\/issues$/);
        await expect(page.getByTestId('issues-list')).toBeVisible();
    });

    test('Wrong password errors and stays on /login', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.login(users.admin.email, 'password1234');

        await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
        await expect(page).toHaveURL(/\/login$/);
        await expect(loginPage.heading).toBeVisible();
    });

    test('Empty form shows a validation error and stays on /login', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        await loginPage.submitButton.click();

        await expect(loginPage.errorMessage).toHaveText('Validation failed');
        await expect(page).toHaveURL(/\/login$/);
        await expect(loginPage.heading).toBeVisible();
    }); 

    test('Visiting /issues while logged out redirects to /login', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto('/issues');

        await expect(page).toHaveURL(/\/login$/);
        await expect(loginPage.heading).toBeVisible();
    });
});