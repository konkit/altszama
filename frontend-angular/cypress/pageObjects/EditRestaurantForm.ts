
export default class EditRestaurantForm {

  static fillNameField(value: string) {
    // let inputSelector = Selector("label").withText("Name").parent().find("input");
    // await t.typeText(inputSelector, value)
    cy.get("[data-cy='restaurant-name-input']").clear().type(value)
  }

  static fillUrlField(value: string) {
    // let inputSelector = Selector("label").withText("Url").parent().find("input");
    // await t.typeText(inputSelector, value)
    cy.get("[data-cy='restaurant-url-input']").clear().type(value)
  }

  static submit() {
    // await t.click(Selector("button").withText("CREATE"))
    cy.get("button").contains("Update").click()
  }
}
