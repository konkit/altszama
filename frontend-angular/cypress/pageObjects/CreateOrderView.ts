import TodaysOrderView from "./TodaysOrderView";

export default class CreateOrderView {

  static expectNoRestaurantsAlert() {
    cy.get("main div").contains("There are no restaurants available to create an order from.")
  }

  static createOrderWithDefaultValues(restaurantName: string) {
    TodaysOrderView.clickAddNewOrderButton();

    cy.contains(restaurantName).click();
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Create").click();
    cy.get("h1").contains(`Order from ${restaurantName}`)
  }

  static goToOrder(restaurantName: string) {
    cy.get("mat-action-list").contains(restaurantName).click()
  }

}
