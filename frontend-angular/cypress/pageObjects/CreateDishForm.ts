
export default class CreateDishForm {
  static async fillNameField(value: string) {
    cy.get("[data-cy='dish-name-input']").clear().type(value)
  }

  static async fillPriceField(value: string) {
    cy.get("[data-cy='dish-price-input']").clear().type(value)
  }

  static submit() {
    cy.get("button").contains("Submit").click()
  }

  static cancel() {
    cy.get("button").contains("Cancel").click()
  }

  static expectNameValidationError() {
    cy.get("[data-cy='dish-name-input']").parents("mat-form-field").should("have.class", "ng-invalid")
  }

  static expectPriceValidationError() {
    cy.get("[data-cy='dish-price-input']").parents("mat-form-field").should("have.class", "ng-invalid")
  }
}
