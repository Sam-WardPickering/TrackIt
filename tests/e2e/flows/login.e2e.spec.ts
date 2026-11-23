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

        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole('heading', { name: 'Sign in to TrackIt' })).toBeVisible();
        await expect(page.getByTestId('login-error')).toBeVisible();
        await expect(page.getByTestId('login-error')).toHaveText('Invalid credentials');
    });
});