import { BaseSwagLabPage } from './BaseSwagLab.page';
import { getItemsListData } from '../helper_func';

export class CheckoutPageStepTwo extends BaseSwagLabPage {
    url = '/checkout-step-two.html';

    get checkoutItems() { return this.page.locator('.cart_item'); }

    get summaryInfo() {return this.page.locator('.summary_info');}

    get priceTotal() { return this.page.locator('.summary_total_label'); }

    get itemTotal() {return this.page.locator('.summary_subtotal_label');}

    get tax() { return this.page.locator('.summary_tax_label'); }

    async getCheckoutItemsList() {
        return getItemsListData(await this.checkoutItems.all())
    }

    async getPriceTotal() {
        let price = await this.priceTotal.textContent();
        price = parseFloat(price.replace('Total: $', ''));
        return price;
    }

    async getItemTotal() {
        let itemTotal = await this.itemTotal.textContent();
        itemTotal = parseFloat(itemTotal.replace('Item total: $', ''));
        return itemTotal;
    }

    async getTax() {
        let tax = await this.tax.textContent();
        tax = parseFloat(tax.replace('Tax: $', ''));
        return tax;
    }

    async calculateItemTotal(itemsAvailable, randomIndex) {
        let itemTotalPrice = 0;
        for (let i of randomIndex){
            let price = await itemsAvailable[i].price;
            price = parseFloat(price.replace('$', ''));
            itemTotalPrice += price;
        }
        return itemTotalPrice;
    }
}