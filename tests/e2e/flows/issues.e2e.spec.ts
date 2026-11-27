import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { IssuesPage } from '../pages/IssuesPage';
import { users } from '../../test-data/users';
import { uniqueTitle } from '../../helpers/issues';

test.describe('Issues', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(users.admin.email, users.admin.password);
        await expect(page).toHaveURL(/\/issues$/);
    });

    test('Creating an issue shows it in the list with a success notice', async ({ page }) => {
        const issuesPage = new IssuesPage(page);
        const title = uniqueTitle('create');

        await issuesPage.createIssue(title);

        await expect(issuesPage.notice).toHaveText('Issue created.');
        await expect(issuesPage.issuesList.getByText(title)).toBeVisible();
    });

    test('Changing an issues status updates its badge', async ({ page }) => {
        const issuesPage = new IssuesPage(page);
        const title = uniqueTitle('status');

        await issuesPage.createIssue(title);

        await expect(issuesPage.notice).toHaveText('Issue created.');
        await expect(issuesPage.row(title).getByTestId('status-badge-open')).toBeVisible();
        
        await issuesPage.changeStatus(title, 'in_progress');
        await expect(issuesPage.notice).toHaveText(/moved to In Progress\./);
        await expect(issuesPage.row(title).getByTestId('status-badge-in_progress')).toBeVisible();
    });

    test('Filtering by Open shows only open issues', async ({ page }) => {
        const issuesPage = new IssuesPage(page);
        const titleOpen = uniqueTitle('filter-open');
        const titleClosed = uniqueTitle('filter-closed');

        await issuesPage.createIssue(titleOpen);
        await expect(issuesPage.row(titleOpen).getByTestId('status-badge-open')).toBeVisible();

        await issuesPage.createIssue(titleClosed);
        await issuesPage.changeStatus(titleClosed, 'closed');
        await expect(issuesPage.notice).toHaveText(/moved to Closed\./);
        await expect(issuesPage.row(titleClosed).getByTestId('status-badge-closed')).toBeVisible();

        await issuesPage.filterByStatus('open');

        await expect(issuesPage.row(titleOpen).getByTestId('status-badge-open')).toBeVisible();
        await expect(issuesPage.row(titleClosed)).toHaveCount(0);
    });

    test('Deleting an issue removes it from the list', async ({ page }) => {
        const issuesPage = new IssuesPage(page);
        const title = uniqueTitle('delete');

        await issuesPage.createIssue(title);
        await expect(issuesPage.notice).toHaveText('Issue created.');
        await expect(issuesPage.row(title)).toBeVisible();

        await issuesPage.deleteIssue(title);

        await expect(issuesPage.notice).toHaveText(/deleted\./);
        await expect(issuesPage.row(title)).toHaveCount(0);
    });
});