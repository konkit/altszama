import 'testcafe';
import {TokenAuthorization} from "../lib/TokenAuthorization";
import {TestEnvApi} from "../lib/TestEnvApi";
import Navigation from "../pageObjects/Navigation";
import Toolbar from "../pageObjects/Toolbar";
import TodaysOrderView from "../pageObjects/TodaysOrderView";
import CreateOrderView from "../pageObjects/CreateOrderView";
import RestaurantsListView from "../pageObjects/RestaurantsListView";
import CreateRestaurantForm from "../pageObjects/CreateRestaurantForm";
import ShowRestaurantView from "../pageObjects/ShowRestaurantView";
import CreateDishForm from "../pageObjects/CreateDishForm";
import EditDishForm from "../pageObjects/EditDishForm";
import EditRestaurantForm from "../pageObjects/EditRestaurantForm";

const TARGET_PORT = process.env.TARGET_PORT;

const tokenAuthorization = new TokenAuthorization();
const testEnvApi = new TestEnvApi()


const johnDoe = {
    username: "John Doe",
    email: "john.doe@altszama.club"
}


fixture(`Create restaurant and dish`)
    .before(async _ => {
        await testEnvApi.clearEverything()
        await testEnvApi.generateTeamAndUsers()
        await tokenAuthorization.init(johnDoe)
    })
    .beforeEach(async t => {
        await t.resizeWindow(1400, 700)
    })
    .page`http://localhost:${TARGET_PORT}/orders`
    .requestHooks(tokenAuthorization);


test('Create restaurant and dish, update and delete', async _ => {
    await TodaysOrderView.expectNoOrdersMadeYet();
    await TodaysOrderView.clickAddNewOrderButton();

    await CreateOrderView.expectNoRestaurantsAlert();

    await Navigation.clickRestaurantAndDishesMenuEntry();

    await RestaurantsListView.expectNoDataInRestaurantTable();

    await RestaurantsListView.clickCreateNewRestaurantButton();
    await Toolbar.toolbarShouldContain("Create restaurant");
    await CreateRestaurantForm.fillNameField("Restaurant 1")
    await CreateRestaurantForm.fillUrlField("http://pyszne.pl")
    await CreateRestaurantForm.submit();

    await Toolbar.toolbarShouldContain("Restaurants");
    await RestaurantsListView.expectRestaurantInTable("Restaurant 1");
    await RestaurantsListView.goToRestaurant("Restaurant 1");

    await ShowRestaurantView.clickCreateNewDishButton()
    await CreateDishForm.fillNameField("New dish")
    await CreateDishForm.fillPriceField("1,23")
    await CreateDishForm.submit()

    await ShowRestaurantView.dishExists("New dish", "1,23")

    await ShowRestaurantView.clickCreateNewDishButton()
    await CreateDishForm.submit()
    await CreateDishForm.expectValidationError("Dish name cannot be blank")
    await Toolbar.goBack()

    await ShowRestaurantView.clickCreateNewDishButton()
    await CreateDishForm.fillNameField("New dish")
    await CreateDishForm.fillPriceField("-1,23")
    await CreateDishForm.submit()
    await CreateDishForm.expectValidationError("Dish price must not be negative")
    await Toolbar.goBack()

    await ShowRestaurantView.editDish("New dish")
    await EditDishForm.fillNameField("New dish edited")
    await EditDishForm.fillPriceField("3,33")
    await EditDishForm.submit()

    await ShowRestaurantView.dishExists("New dish edited", "3,33")

    await ShowRestaurantView.deleteDish("New dish edited")

    await ShowRestaurantView.dishNotExists("New dish edited", "3,33")

    await ShowRestaurantView.editRestaurant()
    await EditRestaurantForm.fillNameField("Edited restaurant 1")
    await EditRestaurantForm.fillUrlField("http://pyszne.pl/restaurant2")
    await EditRestaurantForm.submit()

    await Toolbar.toolbarShouldContain("Edited restaurant 1")

    await ShowRestaurantView.deleteRestaurant()

    await Toolbar.toolbarShouldContain("Restaurants")

    await RestaurantsListView.expectNoDataInRestaurantTable();
});
