
export default class RestaurantsListView {

  static expectNoDataInRestaurantTable() {
    cy.get("main mat-paginator").contains("0 of 0")
  }

  static clickCreateNewRestaurantButton() {
    cy.get("button").contains("Create new restaurant").click()
  }
}
