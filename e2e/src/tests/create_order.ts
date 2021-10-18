import 'testcafe';
import {TestEnvApi} from "../lib/TestEnvApi";
import TodaysOrderView from "../pageObjects/TodaysOrderView";
import CreateOrderView from "../pageObjects/CreateOrderView";
import ShowOrderView from "../pageObjects/ShowOrderView";
import OrderingView from "../pageObjects/OrderingView";
import LoginView from "../pageObjects/LoginView";

const TARGET_PORT = process.env.TARGET_PORT;

const PARENT_URL = `http://localhost:${TARGET_PORT}`

const testEnvApi = new TestEnvApi()

const johnDoe = {
    username: "John Doe",
    email: "john.doe@altszama.club"
}

const jamesBond = {
    username: "James Bond",
    email: "james.bond@altszama.club"
}

fixture(`Create order`)
    .beforeEach(async t => {
        await testEnvApi.clearEverything()
        await testEnvApi.generateRestaurantsAndDishes()
        await t.resizeWindow(1400, 800)
    })
    .page `${PARENT_URL}/`


test('Create order with single user', async () => {
    await LoginView.loginAs(johnDoe.username)

    await TodaysOrderView.expectNoOrdersMadeYet();

    await CreateOrderView.createOrderWithDefaultValues("Chinese spot")

    await CreateOrderView.goToOrder("Chinese spot")
    await ShowOrderView.addEntry("Dish 1", "1,00")

    await ShowOrderView.placeOrder()
    await OrderingView.setAsOrdered()
    await ShowOrderView.setAsDelivered()
});

test('Create order with two users', async () => {
    await LoginView.loginAs(johnDoe.username)

    await TodaysOrderView.expectNoOrdersMadeYet();

    await CreateOrderView.createOrderWithDefaultValues("Chinese spot")

    await CreateOrderView.goToOrder("Chinese spot")
    await ShowOrderView.addEntry("Dish 1", "1,00")

    await LoginView.logout()
    await LoginView.loginAs(jamesBond.username)

    await CreateOrderView.goToOrder("Chinese spot")
    await ShowOrderView.addCustomEntry("Custom Dish 1", "2,50")

    await LoginView.logout()
    await LoginView.loginAs(johnDoe.username)

    await CreateOrderView.goToOrder("Chinese spot")
    await ShowOrderView.placeOrder()
    await OrderingView.setAsOrdered()
    await ShowOrderView.setAsDelivered()
});
