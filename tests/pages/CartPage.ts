import { type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { InventoryPage } from './InventoryPage';

export class CartPage extends BasePage {
  get items(): Locator {
    return this.page.locator('.cart_item');
  }

  itemLabel(productName: string): Locator {
    return this.page.locator('.cart_item_label').filter({ hasText: productName });
  }

  itemPrice(price: string): Locator {
    return this.page.getByText(price);
  }

  removeButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="remove-${productSlug}"]`);
  }

  get continueShoppingButton(): Locator {
    return this.page.locator('[data-test="continue-shopping"]');
  }

  get checkoutButton(): Locator {
    return this.page.locator('[data-test="checkout"]');
  }

  async removeItem(productSlug: string): Promise<void> {
    await this.removeButton(productSlug).click();
  }

  async continueShopping(): Promise<InventoryPage> {
    await this.continueShoppingButton.click();
    const { InventoryPage } = await import('./InventoryPage');
    return new InventoryPage(this.page);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
