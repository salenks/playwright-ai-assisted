import { type Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';
import { ProductDetailPage } from './ProductDetailPage';

export class InventoryPage extends BasePage {
  addToCartButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
  }

  removeButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="remove-${productSlug}"]`);
  }

  get allAddToCartButtons(): Locator {
    return this.page.locator('[data-test^="add-to-cart-"]');
  }

  async addToCart(productSlug: string): Promise<void> {
    await this.addToCartButton(productSlug).click();
  }

  async removeFromCart(productSlug: string): Promise<void> {
    await this.removeButton(productSlug).click();
  }

  async openProductDetail(productName: string): Promise<ProductDetailPage> {
    await this.page.locator('.inventory_item_name').filter({ hasText: productName }).click();
    return new ProductDetailPage(this.page);
  }

  async openFirstProductDetail(): Promise<ProductDetailPage> {
    await this.page.locator('.inventory_item_name').first().click();
    return new ProductDetailPage(this.page);
  }

  async goToCart(): Promise<CartPage> {
    await this.page.locator('.shopping_cart_link').click();
    return new CartPage(this.page);
  }

  async logout(): Promise<void> {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
    await this.page.locator('#logout_sidebar_link').click();
  }
}
