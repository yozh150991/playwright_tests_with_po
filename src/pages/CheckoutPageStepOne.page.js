const { BaseSwagLabPage } = require('./BaseSwagLab.page');

export class CheckoutPageStepOne extends BaseSwagLabPage {
    url = '/checkout-step-one.html';

    get firstNameInput() { return this.page.locator('#first-name'); }

    get lastNameInput() { return this.page.locator('#last-name'); }

    get postalCodeInput() { return this.page.locator('#postal-code'); }

    get continueButton() { return this.page.locator('#continue'); }

    async fillConfirmCheckout(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }
}