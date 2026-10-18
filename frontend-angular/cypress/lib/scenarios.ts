import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import LoginView from "../pageObjects/LoginView";

export const johnDoe = {
  username: "John Doe",
  email: "john.doe@altszama.club"
}

export const jamesBond = {
  username: "James Bond",
  email: "james.bond@altszama.club"
}

export const RESTAURANT_NAME = "Chinese spot"

// John Doe creates an order and adds "Dish 1" (1,00 zł), James Bond adds a custom dish (2,50 zł).
// Ends logged in as John Doe on the order page.
export function createOrderWithTwoParticipants() {
  LoginView.loginAs(johnDoe.username)
  CreateOrderView.createOrderWithDefaultValues(RESTAURANT_NAME)
  ShowOrderView.addEntry(johnDoe.username, "Dish 1", "1,00")
  LoginView.logout()

  LoginView.loginAs(jamesBond.username)
  CreateOrderView.goToOrder(RESTAURANT_NAME)
  ShowOrderView.addCustomEntry(jamesBond.username, "Custom Dish 1", "2,50")
  LoginView.logout()

  LoginView.loginAs(johnDoe.username)
  CreateOrderView.goToOrder(RESTAURANT_NAME)
}

export function entryCard(username: string) {
  return cy.get("[data-cy='existing-order-entry']").contains(username).parents("[data-cy='existing-order-entry']")
}
