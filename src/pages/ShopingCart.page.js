const { BaseSwagLabPage } = require('./BaseSwagLab.page');
import { getItemsListData } from '../helper_func';

export class ShopingCartPage extends BaseSwagLabPage {
    url = '/cart.html';
    removeItemSelector = '[id^="remove"]';
    get headerTitle() { return this.page.locator('.title'); }

    get cartItems() { return this.page.locator('.cart_item'); }

    get checkoutButton() { return this.page.locator('#checkout'); }
    
    // async below added to show the function returns a promise
    async getCartItemByName(name) { return this.page.locator(this.cartItemSelector, { hasText: name }); }

    async removeCartItemByName(name) {
        const item = await this.getCartItemByName(name);
        return item.locator(this.removeItemSelector);
    }

    async removeCartItemById(id) {
        await this.cartItems.nth(id).locator(this.removeItemSelector).click();
    }
    async getCartItemsList() {
        return getItemsListData(await this.cartItems.all());
    }
}
