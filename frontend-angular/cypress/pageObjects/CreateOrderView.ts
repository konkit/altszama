import TodaysOrderView from "./TodaysOrderView";

export default class CreateOrderView {

  static expectNoRestaurantsAlert() {
    cy.get("main mat-card").contains("There are no restaurants, please create one first")
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
