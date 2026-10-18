import TodaysOrderView from "./TodaysOrderView";

export default class CreateOrderView {

  static expectNoRestaurantsAlert() {
    cy.get("main div").contains("There are no restaurants available to create an order from.")
  }

  static createOrderWithDefaultValues(restaurantName: string) {
    TodaysOrderView.clickAddNewOrderButton();

    cy.get("mat-list-option").contains(restaurantName).click();
    cy.get("button").contains("Create order").click();
    cy.get("h1").contains(restaurantName)
  }

  static goToOrder(restaurantName: string) {
    cy.get("mat-card").contains(restaurantName).parents("mat-card").find("mat-card-actions button").click()
  }

}
