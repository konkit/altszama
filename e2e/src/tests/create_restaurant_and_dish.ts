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

const tokenAuthorization = new TokenAuthorization();
const testEnvApi = new TestEnvApi()

fixture(`Feature: my new feature`)
  .before( async _ => {
    await tokenAuthorization.init()
  })
  .beforeEach(async t => {
    await testEnvApi.clearEverything()
    await t.resizeWindow(1400, 700)
  })
  .page `http://localhost:8080/orders`
  .requestHooks(tokenAuthorization);

test('Create restaurant and dish', async t => {
  await TodaysOrderView.expectNoOrdersMadeYet();
  await TodaysOrderView.clickAddNewOrderButton();

  await CreateOrderView.expectNoRestaurantsAlert();

  await Navigation.clickRestaurantAndDishesMenuEntry();

  await RestaurantsListView.expectNoDataInRestaurantTable();
  await RestaurantsListView.clickCreateNewRestaurantButton();

  await Toolbar.toolbarShouldContain("Create restaurant");

  await CreateRestaurantForm.fillNameField("Restaurant 1")
  await CreateRestaurantForm.fillUrlField("http://pyszne.pl")
  await CreateRestaurantForm.clickCreateRestaurantButton();

  await Toolbar.toolbarShouldContain("Restaurants");
  await RestaurantsListView.expectRestaurantInTable("Restaurant 1");
  await RestaurantsListView.goToRestaurant("Restaurant 1");

  await ShowRestaurantView.clickCreateNewDishButton()
  await CreateDishForm.fillNameField("New dish")
  await CreateDishForm.fillPriceField("1,23")
  await CreateDishForm.clickCreateDishButton()

  await ShowRestaurantView.dishExists("New dish", "1,23")

  await ShowRestaurantView.clickCreateNewDishButton()
  // Do not fill the form
  await CreateDishForm.clickCreateDishButton()
  await CreateDishForm.expectValidationError("Name cannot be blank!")

  await Toolbar.goBack()

  await ShowRestaurantView.editDish("New dish")

  await EditDishForm.fillNameField("New dish edited")
  await EditDishForm.fillPriceField("3,33")

  await EditDishForm.clickUpdateDishButton()

  await ShowRestaurantView.dishExists("New dish edited", "3,33")

  await ShowRestaurantView.deleteDish("New dish edited")

  await ShowRestaurantView.dishNotExists("New dish edited", "3,33")

  await t.debug()
});
