const { expect } = require('@playwright/test');
const { test } = require('../fixture');
import { sortItems, calculateRandomIndexItems} from '../helper_func';
import {filterOptions} from '../test_data';
import {userData, userCredentials} from '../user_data';

test.describe('Verify sorting and adding products', () => {
    test.beforeEach(async ({ loginPage}) => {
        const user = userCredentials;
        await loginPage.navigate();
        await loginPage.performLogin(user.username, user.password);
    });
    for (const option of filterOptions) {
        test(`Perform and verify ${option.description}`, async ({ inventoryPage }) => {
            const inventoryItemsBefore = await inventoryPage.getInventoryItemsList();
            let inventoryItemsExpected = sortItems(inventoryItemsBefore, option.name);
            await inventoryPage.performSortPage(option.name);
            const inventoryItemsActual = await inventoryPage.getInventoryItemsList();
            expect(inventoryItemsActual).toEqual(inventoryItemsExpected);
        });
    }
    test('Verify adding products to cart and their content', async ({ inventoryPage, shopingCartPage }) => {
        const inventoryItemsAvailable = await inventoryPage.getInventoryItemsList() ;
        const itemAmount = inventoryItemsAvailable.length;
        const randomIndexItems = await calculateRandomIndexItems(itemAmount);
        await inventoryPage.addRandomItemsToCart(randomIndexItems);
        await inventoryPage.openShoppingCart();
        const itemsAddedToCart = await shopingCartPage.getCartItemsList();
        for (const i of randomIndexItems) {
            const k = randomIndexItems.indexOf(i);
            expect(await inventoryItemsAvailable[i].name).toEqual(itemsAddedToCart[k].name);
            expect(await inventoryItemsAvailable[i].description).toEqual(itemsAddedToCart[k].description);
            expect(await inventoryItemsAvailable[i].price).toEqual(itemsAddedToCart[k].price);
        }
    })
    test('Verify adding products to cart their price during checkout', async ({ inventoryPage, shopingCartPage, checkoutPageStepOne, checkoutPageStepTwo }) => {
        const inventoryItemsAvailable = await inventoryPage.getInventoryItemsList();
        const itemAmount = inventoryItemsAvailable.length;
        const randomIndexItems = await calculateRandomIndexItems(itemAmount);
        await inventoryPage.addRandomItemsToCart(randomIndexItems);
        await inventoryPage.openShoppingCart();
        await shopingCartPage.checkoutButton.click();
        const user = userData;
        await checkoutPageStepOne.fillConfirmCheckout(user.firstName, user.lastName, user.zipCode);
        const checkoutPageItems = await checkoutPageStepTwo.getCheckoutItemsList();
        for (const i of randomIndexItems) {
            const k = randomIndexItems.indexOf(i);
            expect(await inventoryItemsAvailable[i].name).toEqual(checkoutPageItems[k].name);
            expect(await inventoryItemsAvailable[i].description).toEqual(checkoutPageItems[k].description);
            expect(await inventoryItemsAvailable[i].price).toEqual(checkoutPageItems[k].price);
        }
        await expect(checkoutPageStepTwo.summaryInfo).toBeVisible();
        const itemTotalPriceActual = await checkoutPageStepTwo.getItemTotal();
        const itemTotalPriceExpected = await checkoutPageStepTwo.calculateItemTotal(inventoryItemsAvailable, randomIndexItems);
        expect(itemTotalPriceActual).toEqual(itemTotalPriceExpected);
        const tax = await checkoutPageStepTwo.getTax();
        let totalPriceExpected = 0;
        totalPriceExpected = itemTotalPriceExpected + tax;
        totalPriceExpected = parseFloat(totalPriceExpected.toFixed(2));
        const totalPriceActual = await checkoutPageStepTwo.getPriceTotal();
        expect(totalPriceActual).toEqual(totalPriceExpected);
    })
})
