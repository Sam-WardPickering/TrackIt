import { type Page, type Locator } from '@playwright/test';

export class IssuesPage {
    readonly page: Page;
    readonly titleInput: Locator;
    readonly addButton: Locator;
    readonly issuesList: Locator;
    readonly notice: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleInput = page.getByTestId('new-issue-title');
        this.addButton = page.getByTestId('create-issue-submit');
        this.issuesList = page.getByTestId('issues-list');
        this.notice = page.getByTestId('issues-notice');
    }

    async goto() {
        await this.page.goto('/issues');
    }

    async createIssue(title: string) {
        await this.titleInput.fill(title);
        await this.addButton.click();
    }

    row(title: string): Locator {
        return this.issuesList.getByRole('listitem').filter({ hasText: title });
    }

    async changeStatus(title: string, status: string) {
        await this.page
        .getByRole('combobox', { name: `Change status for: ${title}` })
        .selectOption(status);
    }
}