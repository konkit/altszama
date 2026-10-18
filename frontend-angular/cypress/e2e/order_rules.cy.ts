import {TestEnvApi} from "../lib/TestEnvApi";
import {createOrderWithTwoParticipants, entryCard, jamesBond, johnDoe, RESTAURANT_NAME} from "../lib/scenarios";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import EditOrderView from "../pageObjects/EditOrderView";
import LoginView from "../pageObjects/LoginView";

const TARGET_HOST = Cypress.env("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.env("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

describe('Order rules', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateRestaurantsAndDishes(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Locked order cannot be changed by participants until it is unlocked', () => {
    createOrderWithTwoParticipants()
    ShowOrderView.placeOrder()
    cy.contains("Ordering from")
    LoginView.logout()

    LoginView.loginAs(jamesBond.username)
    CreateOrderView.goToOrder(RESTAURANT_NAME)
    cy.get("[data-cy='order-status-chip']").contains("Ordering now")
    cy.get("app-order-next-step").should("contain", "Order is being placed")
    entryCard(jamesBond.username).find("button[aria-label='Edit dish']").should("not.exist")
    cy.get("button").contains("Add entry").should("not.exist")
    LoginView.logout()

    LoginView.loginAs(johnDoe.username)
    CreateOrderView.goToOrder(RESTAURANT_NAME)
    cy.get("app-order-locked-warning-banner").find("button").contains("Unlock").click()
    cy.get("[data-cy='order-status-chip']").contains("Open")
    LoginView.logout()

    LoginView.loginAs(jamesBond.username)
    CreateOrderView.goToOrder(RESTAURANT_NAME)
    entryCard(jamesBond.username).find("button[aria-label='Edit dish']").should("exist")
    cy.get("button").contains("Add entry").should("exist")
  })

  it('Discount and delivery fees are reflected in totals and shares', () => {
    createOrderWithTwoParticipants()
    cy.get("app-order-summary-panel").should("contain", "3,50")

    EditOrderView.open()

    // Invalid values block saving
    EditOrderView.fillDiscount("150")
    EditOrderView.save()
    EditOrderView.expectSaveBlockedWithError("Enter a value between 0 and 100")

    EditOrderView.fillDiscount("10")
    EditOrderView.enableBankTransfer()
    EditOrderView.fillBankTransferNumber("123")
    EditOrderView.save()
    EditOrderView.expectSaveBlockedWithError("An account number has 26 digits")

    EditOrderView.fillBankTransferNumber("61109010140000071219812874")
    EditOrderView.fillDeliveryFee("2,00")
    EditOrderView.fillFeePerDish("0,50")
    EditOrderView.save()

    // John: 1,00 - 10% + 2,00 / 2 + 0,50 = 2,40; James: 2,50 - 10% + 1,00 + 0,50 = 3,75
    cy.location("pathname").should("match", /\/show$/)
    cy.get("app-order-summary-panel")
      .should("contain", "−10 %")
      .and("contain", "6,15")
      .and("contain", "Your share")
      .and("contain", "2,40")
    entryCard(jamesBond.username).should("contain", "3,75")
    cy.get("app-order-summary-panel").should("contain", "61 1090 1014 0000 0712 1981 2874")
  })
})
