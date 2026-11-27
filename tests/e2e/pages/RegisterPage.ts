import { type Page, type Locator } from '@playwright/test';

export class RegisterPage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly createAccountBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.getByTestId('name');
        this.emailInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('password');
        this.createAccountBtn = page.getByTestId('register-submit');
    }

    async goto() {
        await this.page.goto('/register');
    }

    async register(name: string, email: string, password: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.createAccountBtn.click();
    }
}