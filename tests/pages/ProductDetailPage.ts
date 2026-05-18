import { type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import type { InventoryPage } from './InventoryPage';

export class ProductDetailPage extends BasePage {
  get addToCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to cart' });
  }

  get removeButton(): Locator {
    return this.page.getByRole('button', { name: 'Remove' });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.removeButton.click();
  }

  async backToProducts(): Promise<InventoryPage> {
    await this.page.locator('[data-test="back-to-products"]').click();
    const { InventoryPage } = await import('./InventoryPage');
    return new InventoryPage(this.page);
  }
}
