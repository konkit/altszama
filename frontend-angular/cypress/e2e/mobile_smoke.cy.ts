import {TestEnvApi} from "../lib/TestEnvApi";
import {johnDoe, RESTAURANT_NAME} from "../lib/scenarios";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import LoginView from "../pageObjects/LoginView";

const TARGET_HOST = Cypress.env("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.env("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

describe('Mobile smoke test', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateRestaurantsAndDishes(PARENT_URL)
    cy.viewport(390, 844)
  })

  it('Owner creates, places and confirms an order on a phone', () => {
    LoginView.loginAs(johnDoe.username)
    CreateOrderView.createOrderWithDefaultValues(RESTAURANT_NAME)
    ShowOrderView.addEntry(johnDoe.username, "Dish 1", "1,00")

    // On a phone the summary comes before the list of entries, and nothing overflows sideways
    cy.get("app-order-summary-panel").then($summary => {
      cy.get("app-order-entries-list").then($entries => {
        expect($summary[0].getBoundingClientRect().top).to.be.lessThan($entries[0].getBoundingClientRect().top)
      })
    })
    cy.document().its("documentElement.scrollWidth").should("be.lte", 390)

    ShowOrderView.placeOrder()
    cy.contains("Call the restaurant")
    cy.get("app-user-orders").should("contain", "0 of 1 done").and("contain", "Dish 1")
    cy.get("app-user-orders mat-checkbox").first().click()
    cy.get("app-user-orders").should("contain", "1 of 1 done")
    cy.document().its("documentElement.scrollWidth").should("be.lte", 390)

    cy.get("button").contains("Mark as ordered").click()
    cy.get("[data-cy='order-status-chip']").contains("Waiting for delivery")
  })
})
