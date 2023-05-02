import {TestEnvApi} from "../lib/TestEnvApi";
import TodaysOrderView from "../pageObjects/TodaysOrderView";
import CreateOrderView from "../pageObjects/CreateOrderView";
import LoginView from "../pageObjects/LoginView";
import Navigation from "../pageObjects/Navigation";
import RestaurantsListView from "../pageObjects/RestaurantsListView";
import CreateRestaurantForm from "../pageObjects/CreateRestaurantForm";
import ShowRestaurantView from "../pageObjects/ShowRestaurantView";
import CreateDishForm from "../pageObjects/CreateDishForm";
import EditDishForm from "../pageObjects/EditDishForm";
import EditRestaurantForm from "../pageObjects/EditRestaurantForm";

const TARGET_HOST = Cypress.env("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.env("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi();

const johnDoe = {
  username: "John Doe",
  email: "john.doe@altszama.club"
}

describe('Create restaurant and dish', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateTeamAndUsers(PARENT_URL)

    cy.visit(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Create restaurant and dish, update and delete', () => {
    LoginView.loginAs(johnDoe.username)

    TodaysOrderView.expectNoOrdersMadeYet();

    TodaysOrderView.clickAddNewOrderButton();
    CreateOrderView.expectNoRestaurantsAlert();

    Navigation.clickRestaurantAndDishesMenuEntry();
    RestaurantsListView.expectNoDataInRestaurantTable();

    RestaurantsListView.clickCreateNewRestaurantButton();
    CreateRestaurantForm.fillNameField("Restaurant 1")
    CreateRestaurantForm.fillUrlField("http://pyszne.pl")
    CreateRestaurantForm.submit();

    ShowRestaurantView.expectCorrectRestaurantName("Restaurant 1")
    ShowRestaurantView.clickCreateNewDishButton()
    CreateDishForm.fillNameField("New dish")
    CreateDishForm.fillPriceField("1,23")
    CreateDishForm.submit()

    ShowRestaurantView.dishExists("New dish", "1,23")

    ShowRestaurantView.clickCreateNewDishButton()
    CreateDishForm.submit()
    CreateDishForm.expectNameValidationError()
    CreateDishForm.cancel()

    ShowRestaurantView.clickCreateNewDishButton()
    CreateDishForm.fillNameField("New dish")
    CreateDishForm.fillPriceField("-1,23")
    CreateDishForm.submit()
    CreateDishForm.expectPriceValidationError()
    CreateDishForm.cancel()

    ShowRestaurantView.editDish("New dish")
    EditDishForm.fillNameField("New dish edited")
    EditDishForm.fillPriceField("3,33")
    EditDishForm.submit()
    ShowRestaurantView.dishExists("New dish edited", "3,33")

    ShowRestaurantView.deleteDish("New dish edited")
    ShowRestaurantView.dishNotExists("New dish edited", "3,33")

    ShowRestaurantView.editRestaurant()
    EditRestaurantForm.fillNameField("Edited restaurant 1")
    EditRestaurantForm.fillUrlField("http://pyszne.pl/restaurant2")
    EditRestaurantForm.submit()

    ShowRestaurantView.deleteRestaurant()
    RestaurantsListView.expectNoDataInRestaurantTable();
  })
})
