import {TestEnvApi} from "../lib/TestEnvApi";
import TodaysOrderView from "../pageObjects/TodaysOrderView";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import OrderingView from "../pageObjects/OrderingView";
import LoginView from "../pageObjects/LoginView";

const TARGET_HOST = Cypress.env("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.env("TARGET_PORT") || 4200;

const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

const johnDoe = {
  username: "John Doe",
  email: "john.doe@altszama.club"
}

const jamesBond = {
  username: "James Bond",
  email: "james.bond@altszama.club"
}

describe('Create Order', () => {

  beforeEach(() => {
    cy.visit(PARENT_URL)

    testEnvApi.clearEverything(PARENT_URL)
    testEnvApi.generateRestaurantsAndDishes(PARENT_URL)
    cy.viewport(1400, 800)
  })

  it('Create order with single user', () => {
    LoginView.loginAs(johnDoe.username)

    TodaysOrderView.expectNoOrdersMadeYet();

    CreateOrderView.createOrderWithDefaultValues("Chinese spot")

    ShowOrderView.addEntry(johnDoe.username, "Dish 1", "1,00")

    ShowOrderView.placeOrder()
    OrderingView.setAsOrdered()
    ShowOrderView.setAsDelivered()
  })

  it('Create order with two users', () => {
    LoginView.loginAs(johnDoe.username)

    TodaysOrderView.expectNoOrdersMadeYet();

    CreateOrderView.createOrderWithDefaultValues("Chinese spot")

    ShowOrderView.addEntry(johnDoe.username, "Dish 1", "1,00")

    LoginView.logout()
    LoginView.loginAs(jamesBond.username)

    CreateOrderView.goToOrder("Chinese spot")
    ShowOrderView.addCustomEntry(jamesBond.username, "Custom Dish 1", "2,50")

    LoginView.logout()
    LoginView.loginAs(johnDoe.username)

    CreateOrderView.goToOrder("Chinese spot")
    ShowOrderView.placeOrder()
    OrderingView.setAsOrdered()
    ShowOrderView.setAsDelivered()
  })
})
