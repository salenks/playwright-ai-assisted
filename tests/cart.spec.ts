import { test, expect, Page } from '@playwright/test';

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

async function login(page: Page) {
  await page.goto('/');
  await page.locator('#user-name').fill(USERNAME);
  await page.locator('#password').fill(PASSWORD);
  await Promise.all([
    page.waitForURL('/inventory.html', { waitUntil: 'domcontentloaded' }),
    page.locator('#login-button').click(),
  ]);
  await page.locator('.inventory_list').waitFor();
}

test.describe('Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-CART-001: Add a single item to cart from the inventory page', async ({ page }) => {
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CART-002: Remove an item from the inventory page', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-CART-003: Add multiple items — badge count increments correctly', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-fleece-jacket"]')).toBeVisible();

    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-onesie"]')).toBeVisible();
  });

  test('TC-CART-004: Add all six products to the cart', async ({ page }) => {
    for (const product of ALL_PRODUCTS) {
      await page.locator(`[data-test="add-to-cart-${product}"]`).click();
    }

    await expect(page.locator('.shopping_cart_badge')).toHaveText('6');
    await expect(page.locator('[data-test^="add-to-cart-"]')).toHaveCount(0);

    for (const product of ALL_PRODUCTS) {
      await expect(page.locator(`[data-test="remove-${product}"]`)).toBeVisible();
    }
  });

  test('TC-CART-005: Add an item to cart from the product detail page', async ({ page }) => {
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    await page.locator('.inventory_item_name').filter({ hasText: 'Sauce Labs Onesie' }).click();
    await expect(page).toHaveURL(/inventory-item\.html/);

    // Detail page uses a generic button without a product-slug data-test attribute
    await page.getByRole('button', { name: 'Add to cart' }).click();

    await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CART-006: Remove an item from the product detail page', async ({ page }) => {
    await page.locator('.inventory_item_name').filter({ hasText: 'Sauce Labs Onesie' }).click();
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-CART-007: View cart contents', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('/cart.html');

    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
    await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();

    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('TC-CART-008: Remove one item from the cart page', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('.shopping_cart_link').click();

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Backpack' })).not.toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CART-009: Remove all items from the cart page', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('.shopping_cart_link').click();

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();

    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });

  test('TC-CART-010: Continue Shopping from cart returns to inventory', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.locator('.shopping_cart_link').click();

    await page.locator('[data-test="continue-shopping"]').click();

    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.locator('[data-test="remove-sauce-labs-fleece-jacket"]')).toBeVisible();
  });

  test('TC-CART-011: Cart state persists after navigating away and back', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();

    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/inventory-item\.html/);

    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL('/inventory.html');

    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Fleece Jacket' })).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CART-012: Checkout from empty cart proceeds to checkout step one', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);

    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL('/checkout-step-one.html');
  });

  test('TC-CART-013: Cart badge cannot exceed total product count (6)', async ({ page }) => {
    await expect(page.locator('[data-test^="add-to-cart-"]')).toHaveCount(6);

    for (const product of ALL_PRODUCTS) {
      await page.locator(`[data-test="add-to-cart-${product}"]`).click();
    }

    await expect(page.locator('.shopping_cart_badge')).toHaveText('6');
    await expect(page.locator('[data-test^="add-to-cart-"]')).toHaveCount(0);
  });

  test('TC-CART-014: Add/Remove cycle does not corrupt cart count', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.cart_item_label').filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
  });

  test('TC-CART-015: Cart is reset after logout and re-login', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').waitFor({ state: 'visible' });
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL('/');

    // SauceDemo persists cart in localStorage — clear it to simulate a fresh browser session
    await page.evaluate(() => localStorage.clear());

    await login(page);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
  });
});
