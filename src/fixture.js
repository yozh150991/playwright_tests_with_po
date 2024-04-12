import { test as base } from '@playwright/test';
import { LoginPage } from './pages/Login.page';
import { InventoryPage } from './pages/Inventory.page';
import { ShopingCartPage } from './pages/ShopingCart.page';
import { CheckoutPageStepOne } from './pages/CheckoutPageStepOne.page';
import { CheckoutPageStepTwo } from './pages/CheckoutPageStepTwo.page';

export const test = base.extend({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));;
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    shopingCartPage: async ({ page }, use) => {
        await use(new ShopingCartPage(page));
    },
    checkoutPageStepOne: async ({ page }, use) => {
        await use(new CheckoutPageStepOne(page));
    },
    checkoutPageStepTwo: async ({ page }, use) => {
        await use(new CheckoutPageStepTwo(page));
    },
});
