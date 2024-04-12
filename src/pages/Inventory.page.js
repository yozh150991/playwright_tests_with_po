const { BaseSwagLabPage } = require('./BaseSwagLab.page');
import { getItemsListData } from '../helper_func';

export class InventoryPage extends BaseSwagLabPage {
    url = '/inventory.html';

    get headerTitle() { return this.page.locator('.title'); } //
    get inventoryItems() { return this.page.locator('.inventory_item'); }
    get inventoryItemName() { return this.page.locator('.inventory_item_name'); }
    get inventoryItemPrice() { return this.page.locator('.inventory_item_price'); }
    get inventoryItemDescription() { return this.page.locator('.inventory_item_desc'); }
    get addItemToCartBtns() { return this.page.locator('[id^="add-to-cart"]'); }
    get removeItemFromCartBtns() { return this.page.locator('[id^="remove"]'); }
    get inventorySort() { return this.page.locator('.product_sort_container'); }

    async addItemToCartById(id) {
        await this.addItemToCartBtns.nth(id).click();
    }
    async getInventoryItemsList() {
        return getItemsListData(await this.inventoryItems.all());
    }

    async addRandomItemsToCart(array) {
        const inventoryItemsAvailable = await this.inventoryItems.all();
        for (const index of array) {
            await (inventoryItemsAvailable[index].locator(this.addItemToCartBtns)).click();
        }
    }
    async getRandomItemsData(array){
        const inventoryItemsAvailable = await this.inventoryItems.all();
        const inventoryItemsAdded = await array.map((index) => inventoryItemsAvailable[index]);
        return getItemsListData(inventoryItemsAdded);
    }
    async openShoppingCart() {
        await this.shopingCart.click();
    }
    async performSortPage(value){
        await this.inventorySort.selectOption(value);
    }
}
