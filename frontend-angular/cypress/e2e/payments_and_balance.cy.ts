import {TestEnvApi} from "../lib/TestEnvApi";
import {createOrderWithTwoParticipants, entryCard, jamesBond, johnDoe, RESTAURANT_NAME} from "../lib/scenarios";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import OrderingView from "../pageObjects/OrderingView";
import LoginView from "../pageObjects/LoginView";
import BalanceView from "../pageObjects/BalanceView";

const TARGET_HOST = Cypress.expose("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.expose("TARGET_PORT") || 4200;

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

    BalanceView.open()
    BalanceView.expectNetTotal("You're owed 2,50")
    BalanceView.expectOwedToYou(jamesBond.username, "2,50")
    BalanceView.historyRow(RESTAURANT_NAME).should("contain", "by you").and("contain", "Collecting")
    BalanceView.historyRow(RESTAURANT_NAME).invoke("text").should("match", /1,00\s*zł of 3,50\s*zł collected/)
    LoginView.logout()

    // Participant owes the order owner before paying
    LoginView.loginAs(jamesBond.username)
    BalanceView.open()
    BalanceView.expectNetTotal("You owe 2,50")
    BalanceView.expectYouOwe(johnDoe.username, "2,50")
    BalanceView.historyRow(RESTAURANT_NAME)
      .should("contain", `by ${johnDoe.username}`)
      .and("contain", "Your share 2,50")
      .and("contain", "Unpaid")

    CreateOrderView.goToOrder(RESTAURANT_NAME)
    cy.get("app-order-next-step").should("contain", "Pay 2,50").and("contain", johnDoe.username)
    entryCard(jamesBond.username).find("button").contains("I've paid").click()
    entryCard(jamesBond.username).should("contain", "Paid")
    cy.get("app-order-next-step").should("contain", "All settled")

    BalanceView.open()
    BalanceView.expectNetTotal("All settled up")
    BalanceView.historyRow(RESTAURANT_NAME).should("contain", "Paid").and("not.contain", "Unpaid")
    LoginView.logout()

    // Owner sees the payment and can revert it
    LoginView.loginAs(johnDoe.username)
    CreateOrderView.goToOrder(RESTAURANT_NAME)
    cy.get("app-order-summary-panel").should("contain", "2 of 2 people")
    cy.get("app-order-next-step").should("contain", "All settled")

    BalanceView.open()
    BalanceView.expectNetTotal("All settled up")
    BalanceView.historyRow(RESTAURANT_NAME).should("contain", "Settled")
    BalanceView.historyRow(RESTAURANT_NAME).invoke("text").should("match", /3,50\s*zł of 3,50\s*zł collected/)

    CreateOrderView.goToOrder(RESTAURANT_NAME)
    entryCard(jamesBond.username).find("button[aria-label='Mark as unpaid']").click()
    entryCard(jamesBond.username).should("contain", "Unpaid")
    cy.get("app-order-summary-panel").should("contain", "1 of 2 people")
  })

  it('Owner who marks their own entry as unpaid does not owe money to themselves', () => {
    createOrderWithTwoParticipants()
    ShowOrderView.placeOrder()
    OrderingView.setAsOrdered()
    ShowOrderView.setAsDelivered()

    entryCard(johnDoe.username).find("button[aria-label='Mark as unpaid']").click()
    entryCard(johnDoe.username).should("contain", "Unpaid")

    BalanceView.open()
    BalanceView.expectNetTotal("You're owed 2,50")
    BalanceView.expectOwedToYou(jamesBond.username, "2,50")
    BalanceView.expectNotListed(johnDoe.username)
  })
})
