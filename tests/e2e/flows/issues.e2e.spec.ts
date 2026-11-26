import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { IssuesPage } from '../pages/IssuesPage';
import { users } from '../../test-data/users';
import { createUniqueTitle } from '../../helpers/issues';

test.describe('Issues', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(users.admin.email, users.admin.password);
        await expect(page).toHaveURL(/\/issues$/);
    });

    test('Creating an issue shows it in the list with a success notice', async ({ page }) => {
        const issuesPage = new IssuesPage(page);
        const title = createUniqueTitle();
        await issuesPage.createIssue(title);

        await expect(issuesPage.notice).toHaveText('Issue created.');
        await expect(issuesPage.issuesList.getByText(title)).toBeVisible();
    });

    // test('Changing an issues status updates its badge', async ({ page }) => {
    //     const issuesPage = new IssuesPage(page);
    //     const title = 
    // })
});