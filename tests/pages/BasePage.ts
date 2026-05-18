import { type Page, type Locator } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  get cartBadge(): Locator {
    return this.page.locator('.shopping_cart_badge');
  }
}
