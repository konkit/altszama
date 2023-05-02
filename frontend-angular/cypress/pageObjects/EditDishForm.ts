
export default class EditDishForm {

  static async fillNameField(value: string) {
    cy.get("[data-cy='dish-name-input']").clear().type(value)
  }

  static async fillPriceField(value: string) {
    cy.get("[data-cy='dish-price-input']").clear().type(value)
  }

  static submit() {
    // await t.click(Selector("button").withText("CREATE"))
    cy.get("button").contains("Submit").click()
  }
}
