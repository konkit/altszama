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

const tokenAuthorization = new TokenAuthorization();
const testEnvApi = new TestEnvApi()

fixture(`Feature: my new feature`)
  .before( async _ => {
    await tokenAuthorization.init()
    await testEnvApi.clearEverything()
  })
  .beforeEach(async t => {
    await t.resizeWindow(1400, 700)
  })
  .page `http://localhost:8080/orders`
  .requestHooks(tokenAuthorization);

test('Create restaurant and dish', async t => {
  await TodaysOrderView.expectNoOrdersMadeYet(t);
  await TodaysOrderView.clickAddNewOrderButton(t);

  await CreateOrderView.expectNoRestaurantsAlert(t);

  await Navigation.clickRestaurantAndDishesMenuEntry(t);

  await RestaurantsListView.expectNoDataInRestaurantTable(t);
  await RestaurantsListView.clickCreateNewRestaurantButton(t);

  await Toolbar.toolbarShouldContain(t, "Create restaurant");

  await CreateRestaurantForm.fillNameField(t, "Restaurant 1")
  await CreateRestaurantForm.fillUrlField(t, "http://pyszne.pl")
  await CreateRestaurantForm.clickCreateRestaurantButton(t);

  await Toolbar.toolbarShouldContain(t, "Restaurants");
  await RestaurantsListView.expectRestaurantInTable(t, "Restaurant 1");
  await RestaurantsListView.goToRestaurant(t, "Restaurant 1");

  await ShowRestaurantView.clickCreateNewDishButton(t)
  await CreateDishForm.fillNameField(t, "New dish")
  await CreateDishForm.fillPriceField(t, "1,23")
  await CreateDishForm.clickCreateDishButton(t)

  await ShowRestaurantView.dishExists(t, "New dish", "1,23")
});

