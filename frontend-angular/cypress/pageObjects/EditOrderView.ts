export default class EditOrderView {

  static open() {
    cy.get("button").contains("Edit order").click()
    cy.get("h1").contains("Edit order")
  }

  static fillDiscount(value: string) {
    cy.get("[data-cy='discount-input']").clear().type(value).blur()
  }

  static fillDeliveryFee(value: string) {
    cy.get("app-money-input[data-cy='delivery-fee-input'] input").clear().type(value).blur()
  }

  static fillFeePerDish(value: string) {
    cy.get("app-money-input[data-cy='fee-per-dish-input'] input").clear().type(value).blur()
  }

  static enableBankTransfer() {
    cy.get("mat-slide-toggle").contains("Bank transfer").click()
  }

  static fillBankTransferNumber(value: string) {
    cy.get("[data-cy='bank-transfer-number-input']").clear().type(value).blur()
  }

  static save() {
    cy.get("button").contains("Save changes").click()
  }

  static expectSaveBlockedWithError(message: string) {
    cy.get("mat-error").should("contain", message)
    cy.location("pathname").should("match", /\/edit$/)
  }
}
