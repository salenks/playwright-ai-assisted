import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

const ALL_PRODUCTS = [
  'sauce-labs-backpack',
  'sauce-labs-bike-light',
  'sauce-labs-bolt-t-shirt',
  'sauce-labs-fleece-jacket',
  'sauce-labs-onesie',
  'test.allthethings()-t-shirt-(red)',
];

test.describe('Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(USERNAME, PASSWORD);
  });

  test('TC-CART-001: Add a single item to cart from the inventory page', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await expect(inventory.cartBadge).not.toBeVisible();

    await inventory.addToCart('sauce-labs-backpack');

    await expect(inventory.removeButton('sauce-labs-backpack')).toBeVisible();
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('TC-CART-002: Remove an item from the inventory page', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.removeFromCart('sauce-labs-backpack');

    await expect(inventory.addToCartButton('sauce-labs-backpack')).toBeVisible();
    await expect(inventory.cartBadge).not.toBeVisible();
  });

  test('TC-CART-003: Add multiple items — badge count increments correctly', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart('sauce-labs-bike-light');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.addToCart('sauce-labs-bolt-t-shirt');
    await expect(inventory.cartBadge).toHaveText('2');

    await inventory.addToCart('sauce-labs-fleece-jacket');
    await expect(inventory.cartBadge).toHaveText('3');

    await expect(inventory.removeButton('sauce-labs-bike-light')).toBeVisible();
    await expect(inventory.removeButton('sauce-labs-bolt-t-shirt')).toBeVisible();
    await expect(inventory.removeButton('sauce-labs-fleece-jacket')).toBeVisible();

    await expect(inventory.addToCartButton('sauce-labs-backpack')).toBeVisible();
    await expect(inventory.addToCartButton('sauce-labs-onesie')).toBeVisible();
  });

  test('TC-CART-004: Add all six products to the cart', async ({ page }) => {
    const inventory = new InventoryPage(page);

    for (const product of ALL_PRODUCTS) {
      await inventory.addToCart(product);
    }

    await expect(inventory.cartBadge).toHaveText('6');
    await expect(inventory.allAddToCartButtons).toHaveCount(0);

    for (const product of ALL_PRODUCTS) {
      await expect(inventory.removeButton(product)).toBeVisible();
    }
  });

  test('TC-CART-005: Add an item to cart from the product detail page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await expect(inventory.cartBadge).not.toBeVisible();

    const detail = await inventory.openProductDetail('Sauce Labs Onesie');
    await expect(page).toHaveURL(/inventory-item\.html/);

    await detail.addToCart();

    await expect(detail.removeButton).toBeVisible();
    await expect(detail.cartBadge).toHaveText('1');
  });

  test('TC-CART-006: Remove an item from the product detail page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const detail = await inventory.openProductDetail('Sauce Labs Onesie');

    await detail.addToCart();
    await expect(detail.cartBadge).toHaveText('1');

    await detail.removeFromCart();

    await expect(detail.addToCartButton).toBeVisible();
    await expect(detail.cartBadge).not.toBeVisible();
  });

  test('TC-CART-007: View cart contents', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.addToCart('sauce-labs-bike-light');

    const cart = await inventory.goToCart();
    await expect(page).toHaveURL('/cart.html');

    await expect(cart.items).toHaveCount(2);
    await expect(cart.itemLabel('Sauce Labs Backpack')).toBeVisible();
    await expect(cart.itemLabel('Sauce Labs Bike Light')).toBeVisible();
    await expect(cart.itemPrice('$29.99')).toBeVisible();
    await expect(cart.itemPrice('$9.99')).toBeVisible();

    await expect(cart.removeButton('sauce-labs-backpack')).toBeVisible();
    await expect(cart.removeButton('sauce-labs-bike-light')).toBeVisible();
    await expect(cart.continueShoppingButton).toBeVisible();
    await expect(cart.checkoutButton).toBeVisible();
  });

  test('TC-CART-008: Remove one item from the cart page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.addToCart('sauce-labs-bike-light');

    const cart = await inventory.goToCart();
    await cart.removeItem('sauce-labs-backpack');

    await expect(cart.items).toHaveCount(1);
    await expect(cart.itemLabel('Sauce Labs Bike Light')).toBeVisible();
    await expect(cart.itemLabel('Sauce Labs Backpack')).not.toBeVisible();
    await expect(cart.cartBadge).toHaveText('1');
  });

  test('TC-CART-009: Remove all items from the cart page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.addToCart('sauce-labs-bike-light');

    const cart = await inventory.goToCart();
    await cart.removeItem('sauce-labs-backpack');
    await cart.removeItem('sauce-labs-bike-light');

    await expect(cart.items).toHaveCount(0);
    await expect(cart.cartBadge).not.toBeVisible();
    await expect(cart.continueShoppingButton).toBeVisible();
    await expect(cart.checkoutButton).toBeVisible();
  });

  test('TC-CART-010: Continue Shopping from cart returns to inventory', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-fleece-jacket');

    const cart = await inventory.goToCart();
    const backToInventory = await cart.continueShopping();

    await expect(page).toHaveURL('/inventory.html');
    await expect(backToInventory.cartBadge).toHaveText('1');
    await expect(backToInventory.removeButton('sauce-labs-fleece-jacket')).toBeVisible();
  });

  test('TC-CART-011: Cart state persists after navigating away and back', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-fleece-jacket');

    const detail = await inventory.openFirstProductDetail();
    await expect(page).toHaveURL(/inventory-item\.html/);

    const inventoryReturned = await detail.backToProducts();
    await expect(page).toHaveURL('/inventory.html');

    const cart = await inventoryReturned.goToCart();
    await expect(cart.itemLabel('Sauce Labs Fleece Jacket')).toBeVisible();
    await expect(cart.cartBadge).toHaveText('1');
  });

  test('TC-CART-012: Checkout from empty cart proceeds to checkout step one', async ({ page }) => {
    const inventory = new InventoryPage(page);

    const cart = await inventory.goToCart();
    await expect(cart.items).toHaveCount(0);

    await cart.checkout();

    await expect(page).toHaveURL('/checkout-step-one.html');
  });

  test('TC-CART-013: Cart badge cannot exceed total product count (6)', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await expect(inventory.allAddToCartButtons).toHaveCount(6);

    for (const product of ALL_PRODUCTS) {
      await inventory.addToCart(product);
    }

    await expect(inventory.cartBadge).toHaveText('6');
    await expect(inventory.allAddToCartButtons).toHaveCount(0);
  });

  test('TC-CART-014: Add/Remove cycle does not corrupt cart count', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.removeFromCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).not.toBeVisible();

    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    const cart = await inventory.goToCart();
    await expect(cart.items).toHaveCount(1);
    await expect(cart.itemLabel('Sauce Labs Backpack')).toBeVisible();
  });

  test('TC-CART-015: Cart is reset after logout and re-login', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.logout();
    await expect(page).toHaveURL('/');

    // SauceDemo persists cart in localStorage — clear it to simulate a fresh browser session
    await page.evaluate(() => localStorage.clear());

    const loginPage = new LoginPage(page);
    await loginPage.login(USERNAME, PASSWORD);

    await expect(inventory.cartBadge).not.toBeVisible();
    await expect(inventory.addToCartButton('sauce-labs-backpack')).toBeVisible();
  });
});
