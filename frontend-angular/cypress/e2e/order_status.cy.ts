import {TestEnvApi} from "../lib/TestEnvApi";
import {johnDoe, RESTAURANT_NAME} from "../lib/scenarios";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import EditOrderView from "../pageObjects/EditOrderView";
import LoginView from "../pageObjects/LoginView";

const TARGET_HOST = Cypress.expose("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.expose("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

const statusAction = (title: string) =>
  cy.get("app-order-state-buttons li").contains(title).parents("li")

const confirmDialog = () => cy.get("app-delete-confirmation-modal")

describe('Order status', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateRestaurantsAndDishes(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Owner rejects, restores and deletes an order, with confirmations', () => {
    LoginView.loginAs(johnDoe.username)
    CreateOrderView.createOrderWithDefaultValues(RESTAURANT_NAME)
    ShowOrderView.addEntry(johnDoe.username, "Dish 1", "1,00")

    // Open order: only reject and delete are offered
    EditOrderView.open()
    cy.get("app-order-state-buttons").should("not.contain", "Reopen order").and("not.contain", "Restore")

    // Rejecting asks for confirmation; cancelling keeps the order as it was
    statusAction("Mark as rejected").find("button").click()
    confirmDialog().find("button").contains("Cancel").click()
    confirmDialog().should("not.exist")
    cy.location("pathname").should("match", /\/edit$/)

    statusAction("Mark as rejected").find("button").click()
    confirmDialog().find("button").contains("Mark as rejected").click()
    cy.get("[data-cy='order-status-chip']").contains("Rejected")
    cy.get("app-order-next-step").should("contain", "Order rejected")

    // Rejected order: can be restored, can't be rejected again
    EditOrderView.open()
    cy.get("app-order-state-buttons").should("not.contain", "Mark as rejected")
    statusAction("Back to \"Waiting for delivery\"").find("button").click()
    cy.get("[data-cy='order-status-chip']").contains("Waiting for delivery")

    // Ordered order: can be reopened
    EditOrderView.open()
    statusAction("Reopen order").should("exist")

    statusAction("Delete order").find("button").click()
    confirmDialog().find("button").contains("Delete").click()
    cy.location("pathname").should("eq", "/orders/all")
    cy.get("main").should("not.contain", RESTAURANT_NAME)
  })
})
