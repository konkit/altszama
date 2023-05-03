
export default class CreateRestaurantForm {

  static fillNameField(value: string) {
    cy.get("[data-cy='restaurant-name-input']").type(value)
  }

  static fillUrlField(value: string) {
    cy.get("[data-cy='restaurant-url-input']").type(value)
  }

  static submit() {
    cy.get("button").contains("Submit").click()
  }
}
