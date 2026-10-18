import {TestEnvApi} from "../lib/TestEnvApi";
import {jamesBond, johnDoe, RESTAURANT_NAME} from "../lib/scenarios";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import LoginView from "../pageObjects/LoginView";

const TARGET_HOST = Cypress.env("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.env("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

const todayCard = (restaurantName: string) =>
  cy.get("app-today-orders-view mat-card").contains(restaurantName).parents("mat-card")

describe('Navigation', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateRestaurantsAndDishes(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Today\'s orders shows each order once and lets you join; All Orders opens an order and Back returns there', () => {
    LoginView.loginAs(johnDoe.username)
    CreateOrderView.createOrderWithDefaultValues(RESTAURANT_NAME)
    ShowOrderView.addEntry(johnDoe.username, "Dish 1", "1,00")

    // The creator, who also has a dish in the order, sees it once
    cy.get("a").contains("Today's Orders").click()
    cy.get("app-today-orders-view mat-card").should("have.length", 1)
    todayCard(RESTAURANT_NAME).should("contain", "by you").and("contain", "Dish 1")
    LoginView.logout()

    LoginView.loginAs(jamesBond.username)
    CreateOrderView.createOrderWithDefaultValues("Pizzeria")
    cy.get("a").contains("Today's Orders").click()
    cy.get("app-today-orders-view mat-card").should("have.length", 2)
    todayCard(RESTAURANT_NAME).should("contain", johnDoe.username).and("contain", "You haven't joined this order yet.")
    todayCard(RESTAURANT_NAME).find("button").contains("Join order").click()
    cy.get("h1").contains(RESTAURANT_NAME)

    cy.get("a").contains("All Orders").click()
    cy.get("tr.mat-mdc-row").should("have.length", 2)
    cy.get("tr.mat-mdc-row").contains("Pizzeria").parents("tr").should("contain", "you")

    // James created Pizzeria and only opened Chinese spot without adding a dish, so "Mine" keeps just Pizzeria
    cy.get("mat-button-toggle").contains("Mine").click()
    cy.get("tr.mat-mdc-row").should("have.length", 1).and("contain", "Pizzeria")
    cy.get("mat-button-toggle").contains("All").click()
    cy.get("tr.mat-mdc-row").contains(RESTAURANT_NAME).click()
    cy.get("h1").contains(RESTAURANT_NAME)
    cy.get("button").contains("Back").click()
    cy.location("pathname").should("eq", "/orders/all")
  })
})
