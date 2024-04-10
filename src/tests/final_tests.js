const { expect } = require('@playwright/test');
const { test } = require('../fixture');
import { sortItems, calculateRandomIndexItems} from '../helper_func';
import {filterOption} from '../test-data';
import {userCredentials} from '../User_credentials';

test.describe('Verify sorting and adding products', () => {
    for (const value of filterOption) {
        test(`Perform and verify ${value.description}`, async ({ loginPage, inventoryPage }) => {
            const inventoryItemsBefore = await inventoryPage.getInventoryItemsList();
            let inventoryItemsSorted = sortItems(inventoryItemsBefore, value.name);
            await inventoryPage.performSortPage(value.name);
            const inventoryItemsAfter = await inventoryPage.getInventoryItemsList();
            expect(inventoryItemsAfter).toEqual(inventoryItemsSorted);
        });
    }
    test('Verify adding products to cart and their content', async ({ loginPage, inventoryPage, shopingCartPage }) => {
        const inventoryItemsAvailable = await inventoryPage.getInventoryItemsList() ;
        let randomAmount = 0;
        while (randomAmount === 0) {
            randomAmount = Math.floor(Math.random() * (inventoryItemsAvailable.length));
        }
        let randomIndexItems = await calculateRandomIndexItems(randomAmount);
        await inventoryPage.addRandomItemsToCart(randomIndexItems);
        let itemsAddedInCart = await inventoryPage.getRandomItemsData(randomIndexItems);
        await inventoryPage.openShoppingCart();
        const itemsAddedToCart = await shopingCartPage.getCartItemsList();
        for (const i of randomIndexItems) {
            expect(await itemsAddedInCart[i].name).toEqual(itemsAddedToCart[i].name);
            expect(await itemsAddedInCart[i].description).toEqual(itemsAddedToCart[i].description);
            expect(await itemsAddedInCart[i].price).toEqual(itemsAddedToCart[i].price);
        }
    })
    test.only('Verify adding products to cart their price during checkout', async ({ loginPage, inventoryPage, shopingCartPage, checkoutPageStepOne, checkoutPageStepTwo }) => {
        const inventoryItemsAvailable = await inventoryPage.getInventoryItemsList();
        let randomAmount = 0;
        while (randomAmount === 0) {
            randomAmount = Math.floor(Math.random() * (inventoryItemsAvailable.length));
        }
        let randomIndexItems = await calculateRandomIndexItems(randomAmount);
        await inventoryPage.addRandomItemsToCart(randomIndexItems);
        let itemsAddedInCart = await inventoryPage.getRandomItemsData(randomIndexItems);
        await inventoryPage.openShoppingCart();
        await shopingCartPage.checkoutButton.click();
        const user = userCredentials;
        await checkoutPageStepOne.fillConfirmCheckout(user.firstName, user.lastName, user.zipCode);
        const checkoutPageItems = await checkoutPageStepTwo.getCheckoutItemsList();
        for (const i of randomIndexItems) {
            expect(await itemsAddedInCart[i].name).toEqual(checkoutPageItems[i].name);
            expect(await itemsAddedInCart[i].description).toEqual(checkoutPageItems[i].description);
            expect(await itemsAddedInCart[i].price).toEqual(checkoutPageItems[i].price);
        }
        await expect(checkoutPageStepTwo.summaryInfo).toBeVisible();
        const itemTotalPrice = await checkoutPageStepTwo.getItemTotal();
        const calculatedItemTotalPrice = await checkoutPageStepTwo.calculateItemTotal(inventoryItemsAvailable, randomIndexItems);
        expect(itemTotalPrice).toEqual(calculatedItemTotalPrice);
        const tax = await checkoutPageStepTwo.getTax();
        let calculatedTotalPrice = 0;
        calculatedTotalPrice = calculatedItemTotalPrice + tax;
        parseFloat(calculatedTotalPrice.toFixed(2));
        const totalPrice = await checkoutPageStepTwo.getPriceTotal();
        expect(totalPrice).toEqual(calculatedTotalPrice);
    })
})
