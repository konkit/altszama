import {TestEnvApi} from "../lib/TestEnvApi";
import {createOrderWithTwoParticipants, dishRow, entryCard, jamesBond, johnDoe, RESTAURANT_NAME} from "../lib/scenarios";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import LoginView from "../pageObjects/LoginView";

const TARGET_HOST = Cypress.env("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.env("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

describe('Order entries', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateRestaurantsAndDishes(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Participant adds a side dish and a comment, then adds and removes another dish', () => {
    LoginView.loginAs(johnDoe.username)
    CreateOrderView.createOrderWithDefaultValues(RESTAURANT_NAME)
    ShowOrderView.addEntry(johnDoe.username, "Dish 1", "1,00")

    dishRow(johnDoe.username, "Dish 1").find("button[aria-label='Edit dish']").click()
    cy.get("button").contains("Add side dish").click()
    cy.get("[data-cy='side-dish-input']").type("Extra cheese")
    cy.get("app-money-input[data-cy='side-dish-price-input'] input").clear().type("0,50").blur()
    cy.get("[data-cy='comments-input']").type("no onions")
    cy.get("button").contains("Submit").click()

    dishRow(johnDoe.username, "Dish 1")
      .should("contain", "+ Extra cheese")
      .and("contain", "0,50")
      .and("contain", "no onions")
    entryCard(johnDoe.username).should("contain", "1,50")

    cy.get("button").contains("Add entry").click()
    cy.get("input[data-cy=dish-input]").click()
    cy.get("mat-option").contains(/^\s*Dish 2\s*$/).click()
    cy.get("button").contains("Submit").click()
    dishRow(johnDoe.username, "Dish 2").should("contain", "2,00")
    entryCard(johnDoe.username).should("contain", "3,50")

    dishRow(johnDoe.username, "Dish 2").find("button[aria-label='Remove dish']").click()
    entryCard(johnDoe.username).should("not.contain", "Dish 2").and("contain", "1,50")
  })

  it('Order owner can still edit a participant\'s dish after the order is locked', () => {
    createOrderWithTwoParticipants()
    ShowOrderView.placeOrder()
    cy.contains("Ordering from")

    CreateOrderView.goToOrder(RESTAURANT_NAME)
    cy.get("[data-cy='order-status-chip']").contains("Ordering now")
    dishRow(jamesBond.username, "Custom Dish 1").find("button[aria-label='Edit dish']").click()
    cy.get("app-money-input[data-cy=price-input] input").clear().type("3,00").blur()
    cy.get("button").contains("Submit").click()

    dishRow(jamesBond.username, "Custom Dish 1").should("contain", "3,00")
    cy.get("app-order-summary-panel").should("contain", "4,00")
  })
})
