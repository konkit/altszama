import {TestEnvApi} from "../lib/TestEnvApi";
import {johnDoe} from "../lib/scenarios";
import TodaysOrderView from "../pageObjects/TodaysOrderView";
import LoginView from "../pageObjects/LoginView";

const TARGET_HOST = Cypress.env("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.env("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

describe('Create order form', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateRestaurantsAndDishes(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Requires a restaurant and finds restaurants by part of the name', () => {
    LoginView.loginAs(johnDoe.username)
    TodaysOrderView.clickAddNewOrderButton()

    // Nothing is preselected, so creating straight away is blocked
    cy.get("mat-list-option[aria-selected='true']").should("not.exist")
    cy.get("button").contains("Create order").click()
    cy.get("main").should("contain", "Choose a restaurant")
    cy.location("pathname").should("eq", "/orders/create")

    cy.get("[data-cy='restaurant-search-input']").as("search")
    cy.get("@search").type("spot")
    cy.get("mat-list-option").should("have.length", 1).and("contain", "Chinese spot")

    cy.get("@search").clear().type("zzz")
    cy.get("main").should("contain", "No restaurants match")

    cy.get("button[aria-label='Clear search']").click()
    cy.get("mat-list-option").should("have.length", 2)

    cy.get("mat-list-option").contains("Pizzeria").click()
    cy.get("main").should("not.contain", "Choose a restaurant")
    cy.get("button").contains("Create order").click()
    cy.get("h1").contains("Pizzeria")
  })
})
