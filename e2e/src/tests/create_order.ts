import 'testcafe';
import {TokenAuthorization} from "../lib/TokenAuthorization";
import {TestEnvApi} from "../lib/TestEnvApi";
import TodaysOrderView from "../pageObjects/TodaysOrderView";
import Toolbar from "../pageObjects/Toolbar";
import {Selector} from "testcafe";

const TARGET_PORT = process.env.TARGET_PORT;

const tokenAuthorization = new TokenAuthorization();
const testEnvApi = new TestEnvApi()

const johnDoe = {
    username: "John Doe",
    email: "john.doe@altszama.club"
}

fixture(`Create order`)
    .before(async _ => {
        await testEnvApi.clearEverything()
        await testEnvApi.generateRestaurantsAndDishes()
        await tokenAuthorization.init(johnDoe)
    })
    .beforeEach(async t => {
        await t.resizeWindow(1400, 700)
    })
    .page`http://localhost:${TARGET_PORT}/orders`
    .requestHooks(tokenAuthorization);


test('Create order', async t => {
    await TodaysOrderView.expectNoOrdersMadeYet();
    await TodaysOrderView.clickAddNewOrderButton();

    await Toolbar.toolbarShouldContain("Create new order");

    await t.click(Selector(".v-list-item").withText("Chinese spot"))

    await t.click(Selector("button").withText("CONTINUE"))

    await t.click(Selector("button").withText("CREATE"))

    await t.expect(Selector(".v-list-item").withText("Chinese spot").withText("created by John Doe").exists).ok()

    await t.click(Selector(".v-list-item").withText("Chinese spot"))

    await t.click(Selector("button").withText("ADD ENTRY"))

    await t.click(Selector("input#newDishName"))
    await t.click(Selector(".v-select-list .v-list-item").withText("Dish 1"))

    await t.click(Selector("button").withText("SUBMIT"))

    await t.expect(Selector(".v-list-item").withText("Dish 1").withText("1,00").exists).ok()

    await t.click(Selector("button").withText("PLACE ORDER"))

    await t.click(Selector("button").withText("ORDER PLACED"))

    await t.expect(Selector(".v-toolbar .v-toolbar__title").innerText).match(/^\[ORDERED\].+/)

    await t.click(Selector("button").withText("MARK AS DELIVERED"))

    await t.expect(Selector(".v-toolbar .v-toolbar__title").innerText).match(/^\[DELIVERED\].+/)

});
