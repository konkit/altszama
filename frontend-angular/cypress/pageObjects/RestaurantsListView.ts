
export default class RestaurantsListView {

  static expectNoDataInRestaurantTable() {
    cy.get("[data-cy='no-restaurants']").should("contain", "No restaurants yet")
  }

  static clickCreateNewRestaurantButton() {
    cy.get("a").contains("New restaurant").click()
  }
}
