import {TestEnvApi} from "../lib/TestEnvApi";
import {johnDoe} from "../lib/scenarios";
import LoginView from "../pageObjects/LoginView";
import Navigation from "../pageObjects/Navigation";
import RestaurantsListView from "../pageObjects/RestaurantsListView";
import CreateRestaurantForm from "../pageObjects/CreateRestaurantForm";
import ShowRestaurantView from "../pageObjects/ShowRestaurantView";
import CreateDishForm from "../pageObjects/CreateDishForm";
import EditDishForm from "../pageObjects/EditDishForm";

const TARGET_HOST = Cypress.expose("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.expose("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi();

const categoryDishes = (category: string) =>
  cy.get("app-show-restaurant-view h3.category").contains(category).nextUntil("h3.category")

describe('Restaurant forms', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateTeamAndUsers(PARENT_URL)

    cy.visit(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Validates restaurant details and shows them as links', () => {
    LoginView.loginAs(johnDoe.username)
    Navigation.clickRestaurantAndDishesMenuEntry()
    RestaurantsListView.expectNoDataInRestaurantTable()
    RestaurantsListView.clickCreateNewRestaurantButton()

    // Name is required
    CreateRestaurantForm.submit()
    cy.get("mat-error").should("contain", "Name is required")
    cy.location("pathname").should("eq", "/restaurants/create")

    // The menu URL has to be a web address
    CreateRestaurantForm.fillNameField("Bistro")
    CreateRestaurantForm.fillUrlField("pyszne.pl")
    CreateRestaurantForm.submit()
    cy.get("mat-error").should("contain", "Enter an address starting with http:// or https://")
    cy.location("pathname").should("eq", "/restaurants/create")

    cy.get("[data-cy='restaurant-url-input']").clear().type("https://pyszne.pl/bistro")
    cy.get("[data-cy='restaurant-phone-input']").type("600 100 200")
    CreateRestaurantForm.submit()

    ShowRestaurantView.expectCorrectRestaurantName("Bistro")
    cy.get("[data-cy='restaurant-details']").within(() => {
      cy.get("a").contains("Open menu").should("have.attr", "href", "https://pyszne.pl/bistro")
      cy.get("a").contains("600 100 200").should("have.attr", "href", "tel:600100200")
      cy.contains("Not set")
    })

    // The Import API key is hidden until asked for
    Navigation.clickRestaurantAndDishesMenuEntry()
    cy.get("tr.mat-mdc-row").should("have.length", 1).and("contain", "Bistro")
    cy.get("[data-cy='import-api-panel']").click()
    cy.get("[data-cy='import-api-key']").invoke("text").should("match", /^•+$/)
    cy.get("button[aria-label='Show API key']").click()
    cy.get("[data-cy='import-api-key']").invoke("text").should("not.match", /•/)
  })

  it('Creates a new category and validates edited dishes like new ones', () => {
    LoginView.loginAs(johnDoe.username)
    Navigation.clickRestaurantAndDishesMenuEntry()
    RestaurantsListView.clickCreateNewRestaurantButton()
    CreateRestaurantForm.fillNameField("Bistro")
    CreateRestaurantForm.submit()
    ShowRestaurantView.expectCorrectRestaurantName("Bistro")
    cy.get("main").should("contain", "No dishes yet.")

    // A category can be typed in, even though the restaurant has none yet
    ShowRestaurantView.clickCreateNewDishButton()
    CreateDishForm.fillNameField("Tomato soup")
    CreateDishForm.fillPriceField("12,00")
    cy.get("[data-cy='dish-category-input']").type("Soups")
    CreateDishForm.submit()
    categoryDishes("Soups").should("contain", "Tomato soup").and("contain", "12,00")

    // Dishes without a category are listed last
    ShowRestaurantView.clickCreateNewDishButton()
    CreateDishForm.fillNameField("Bread")
    CreateDishForm.fillPriceField("3,00")
    CreateDishForm.submit()
    cy.get("app-show-restaurant-view h3.category").then($headings => {
      expect($headings.map((_, h) => h.textContent?.trim()).get()).to.deep.eq(["Soups", "No category"])
    })

    // The existing category is suggested for the next dish
    ShowRestaurantView.clickCreateNewDishButton()
    cy.get("[data-cy='dish-category-input']").type("So")
    cy.get("mat-option").should("contain", "Soups")
    CreateDishForm.cancel()

    // Editing applies the same rules as creating
    ShowRestaurantView.editDish("Tomato soup")
    cy.get("[data-cy='dish-name-input']").clear()
    EditDishForm.submit()
    cy.get("mat-error").should("contain", "Name is required")
    cy.get("app-edit-dish-form").should("exist")

    EditDishForm.fillNameField("Tomato soup with rice")
    EditDishForm.submit()
    ShowRestaurantView.dishExists("Tomato soup with rice", "12,00")
  })
})
