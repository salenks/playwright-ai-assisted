import { BasePage } from './BasePage';
import { InventoryPage } from './InventoryPage';

export class LoginPage extends BasePage {
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<InventoryPage> {
    await this.page.goto('/');
    await this.page.locator('#user-name').fill(username);
    await this.page.locator('#password').fill(password);
    await Promise.all([
      this.page.waitForURL('/inventory.html', { waitUntil: 'domcontentloaded' }),
      this.page.locator('#login-button').click(),
    ]);
    await this.page.locator('.inventory_list').waitFor();
    return new InventoryPage(this.page);
  }
}
