# Test Plan: SauceDemo — Basic Cart Operations

**Application:** https://www.saucedemo.com (Swag Labs)  
**Scope:** Shopping cart add, remove, and navigation flows  
**Date:** 2026-05-16  
**Base credential:** username `standard_user` / password `secret_sauce`

---

## Application Overview

SauceDemo is a demo e-commerce app with six products. Cart state is reflected via a badge on the cart icon in the top-right header. The cart persists during a session but resets on logout.

**Available products and prices:**

| Product | Price |
|---|---|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

---

## Test Scenarios

### TC-CART-001 — Add a single item to cart from the inventory page

**Starting state:** Logged in as `standard_user`, on the inventory page (`/inventory.html`). Cart is empty.

**Steps:**
1. Verify the cart icon badge is not displayed (cart is empty).
2. Locate the product **Sauce Labs Backpack**.
3. Click the **Add to cart** button next to it.
4. Observe the button label.
5. Observe the cart icon in the header.

**Expected outcome:**
- The button label changes from `Add to cart` to `Remove`.
- The cart icon badge appears displaying `1`.

---

### TC-CART-002 — Remove an item from the inventory page

**Starting state:** Logged in as `standard_user`, on the inventory page. **Sauce Labs Backpack** has already been added to the cart (badge shows `1`).

**Steps:**
1. Locate the **Sauce Labs Backpack** product.
2. Confirm its button reads `Remove`.
3. Click the **Remove** button.
4. Observe the button label.
5. Observe the cart icon badge.

**Expected outcome:**
- The button reverts to `Add to cart`.
- The cart icon badge disappears (cart is empty).

---

### TC-CART-003 — Add multiple items to cart from the inventory page

**Starting state:** Logged in, on the inventory page. Cart is empty.

**Steps:**
1. Click **Add to cart** for **Sauce Labs Bike Light**.
2. Click **Add to cart** for **Sauce Labs Bolt T-Shirt**.
3. Click **Add to cart** for **Sauce Labs Fleece Jacket**.
4. Observe the cart badge after each addition.

**Expected outcome:**
- After first add: badge shows `1`.
- After second add: badge shows `2`.
- After third add: badge shows `3`.
- All three products show a `Remove` button.
- The remaining three products still show `Add to cart`.

---

### TC-CART-004 — Add all six products to the cart

**Starting state:** Logged in, on the inventory page. Cart is empty.

**Steps:**
1. Click **Add to cart** for every product on the page (six items).
2. Observe the cart badge after all additions.

**Expected outcome:**
- Cart badge displays `6`.
- Every product card shows a `Remove` button.

---

### TC-CART-005 — Add an item to cart from the product detail page

**Starting state:** Logged in, on the inventory page. Cart is empty.

**Steps:**
1. Click the product name **Sauce Labs Onesie** to open its detail page.
2. Confirm the URL changes to `/inventory-item.html?id=2` (or equivalent).
3. Verify the **Add to cart** button is visible.
4. Click **Add to cart**.
5. Observe the button label.
6. Observe the cart badge in the header.

**Expected outcome:**
- Button label changes to `Remove`.
- Cart badge displays `1`.

---

### TC-CART-006 — Remove an item from the product detail page

**Starting state:** Logged in. **Sauce Labs Onesie** has been added to the cart via the detail page. User is on the detail page.

**Steps:**
1. Confirm the button on the detail page reads `Remove`.
2. Click **Remove**.
3. Observe the button label.
4. Observe the cart badge.

**Expected outcome:**
- Button reverts to `Add to cart`.
- Cart badge disappears.

---

### TC-CART-007 — View cart contents

**Starting state:** Logged in, on the inventory page. **Sauce Labs Backpack** and **Sauce Labs Bike Light** have been added to the cart.

**Steps:**
1. Click the cart icon in the top-right header.
2. Confirm the URL changes to `/cart.html`.
3. Inspect the items listed.

**Expected outcome:**
- The cart page displays exactly two items: **Sauce Labs Backpack** ($29.99) and **Sauce Labs Bike Light** ($9.99).
- Each item shows its name, description, quantity (`1`), and price.
- Each item has a **Remove** button.
- A **Continue Shopping** button and a **Checkout** button are visible.

---

### TC-CART-008 — Remove an item from the cart page

**Starting state:** On the cart page (`/cart.html`) with **Sauce Labs Backpack** and **Sauce Labs Bike Light** in the cart.

**Steps:**
1. Click **Remove** next to **Sauce Labs Backpack**.
2. Observe the cart contents.
3. Observe the cart badge in the header.

**Expected outcome:**
- **Sauce Labs Backpack** is no longer listed.
- Only **Sauce Labs Bike Light** remains.
- Cart badge updates to `1`.

---

### TC-CART-009 — Remove all items from the cart page

**Starting state:** On the cart page with **Sauce Labs Backpack** and **Sauce Labs Bike Light** in the cart.

**Steps:**
1. Click **Remove** next to **Sauce Labs Backpack**.
2. Click **Remove** next to **Sauce Labs Bike Light**.
3. Observe the cart page.
4. Observe the cart badge.

**Expected outcome:**
- Cart page shows no items.
- Cart badge disappears from the header.
- **Checkout** and **Continue Shopping** buttons are still visible.

---

### TC-CART-010 — Continue Shopping from cart returns to inventory

**Starting state:** On the cart page with at least one item in the cart.

**Steps:**
1. Click the **Continue Shopping** button.
2. Observe the page and URL.

**Expected outcome:**
- User is redirected to the inventory page (`/inventory.html`).
- The cart badge still reflects the number of items previously in the cart.
- Products already added still show a `Remove` button.

---

### TC-CART-011 — Cart state persists after navigating away and back

**Starting state:** Logged in, on the inventory page. **Sauce Labs Fleece Jacket** has been added to the cart.

**Steps:**
1. Navigate to a product detail page (click any product name).
2. Navigate back to the inventory page (click **Back to products** or use browser back).
3. Click the cart icon to open the cart.

**Expected outcome:**
- Cart still contains **Sauce Labs Fleece Jacket**.
- Cart badge still shows `1`.

---

### TC-CART-012 — Empty cart — Checkout button is still reachable

**Starting state:** On the cart page with no items in the cart.

**Steps:**
1. Observe the cart page with zero items.
2. Click the **Checkout** button.

**Expected outcome:**
- User is navigated to the first checkout step (`/checkout-step-one.html`).
- No error is shown for proceeding from an empty cart (SauceDemo does not block this).

---

### TC-CART-013 — Cart badge does not exceed total product count

**Starting state:** Logged in, on the inventory page. Cart is empty.

**Steps:**
1. Add all six products to the cart.
2. Observe the cart badge.
3. Attempt to find any product that still shows `Add to cart`.

**Expected outcome:**
- Cart badge shows exactly `6`.
- All products show `Remove` — no product can be double-added.

---

### TC-CART-014 — Add/Remove cycle does not corrupt cart count

**Starting state:** Logged in, on the inventory page. Cart is empty.

**Steps:**
1. Add **Sauce Labs Backpack** → badge shows `1`.
2. Remove **Sauce Labs Backpack** → badge disappears.
3. Add **Sauce Labs Backpack** again → badge shows `1`.
4. Navigate to cart and verify contents.

**Expected outcome:**
- Cart contains exactly one item: **Sauce Labs Backpack**.
- No duplicate entries.

---

### TC-CART-015 — Cart is reset after logout and re-login

**Starting state:** Logged in as `standard_user`. **Sauce Labs Backpack** is in the cart (badge shows `1`).

**Steps:**
1. Open the hamburger menu (top-left).
2. Click **Logout**.
3. Confirm redirect to the login page.
4. Log back in as `standard_user`.
5. Observe the cart badge on the inventory page.

**Expected outcome:**
- After re-login, the cart badge is absent.
- The inventory page shows all `Add to cart` buttons (no items are pre-selected).

---

## Summary Table

| TC ID | Scenario | Type |
|---|---|---|
| TC-CART-001 | Add single item from inventory | Happy path |
| TC-CART-002 | Remove item from inventory | Happy path |
| TC-CART-003 | Add multiple items, verify badge count | Happy path |
| TC-CART-004 | Add all six products | Boundary |
| TC-CART-005 | Add item from detail page | Happy path |
| TC-CART-006 | Remove item from detail page | Happy path |
| TC-CART-007 | View cart contents | Happy path |
| TC-CART-008 | Remove one item from cart page | Happy path |
| TC-CART-009 | Remove all items from cart page | Edge case |
| TC-CART-010 | Continue Shopping returns to inventory | Navigation |
| TC-CART-011 | Cart persists across page navigation | State persistence |
| TC-CART-012 | Checkout from empty cart | Negative / edge case |
| TC-CART-013 | Badge cannot exceed product count | Boundary |
| TC-CART-014 | Add/Remove cycle integrity | Data integrity |
| TC-CART-015 | Cart resets after logout/re-login | State reset |
