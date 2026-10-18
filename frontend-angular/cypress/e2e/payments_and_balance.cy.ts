import {TestEnvApi} from "../lib/TestEnvApi";
import {createOrderWithTwoParticipants, entryCard, jamesBond, johnDoe, RESTAURANT_NAME} from "../lib/scenarios";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import OrderingView from "../pageObjects/OrderingView";
import LoginView from "../pageObjects/LoginView";

const TARGET_HOST = Cypress.env("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.env("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

describe('Payments and balance', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateRestaurantsAndDishes(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Participant flags payment, owner sees it and can revert it', () => {
    createOrderWithTwoParticipants()
    ShowOrderView.placeOrder()
    OrderingView.setAsOrdered()
    ShowOrderView.setAsDelivered()

    // The owner's own entry counts as paid, so only the participant is outstanding
    cy.get("app-order-summary-panel").should("contain", "1 of 2 people")
    cy.get("app-order-next-step").should("contain", "Collect payments")
    LoginView.logout()

    // Participant owes the order owner before paying
    LoginView.loginAs(jamesBond.username)
    cy.get("a").contains("Balance").click()
    cy.get("main").should("contain", "You owe").and("contain", "2,50").and("contain", johnDoe.username)

    CreateOrderView.goToOrder(RESTAURANT_NAME)
    cy.get("app-order-next-step").should("contain", "Pay 2,50").and("contain", johnDoe.username)
    entryCard(jamesBond.username).find("button").contains("I've paid").click()
    entryCard(jamesBond.username).should("contain", "Paid")
    cy.get("app-order-next-step").should("contain", "All settled")
    LoginView.logout()

    // Owner sees the payment and can revert it
    LoginView.loginAs(johnDoe.username)
    CreateOrderView.goToOrder(RESTAURANT_NAME)
    cy.get("app-order-summary-panel").should("contain", "2 of 2 people")
    cy.get("app-order-next-step").should("contain", "All settled")
    entryCard(jamesBond.username).find("button[aria-label='Mark as unpaid']").click()
    entryCard(jamesBond.username).should("contain", "Unpaid")
    cy.get("app-order-summary-panel").should("contain", "1 of 2 people")
  })
})
