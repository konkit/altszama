import {Selector} from "testcafe";


export default class RestaurantsListView {

  static async expectNoDataInRestaurantTable(t: TestController) {
    await t.expect(Selector("main table").innerText).contains("No data available")
  }

  static async clickCreateNewRestaurantButton(t: TestController) {
    await t.click(Selector("button").withText("CREATE NEW RESTAURANT"))
  }

  static async expectRestaurantInTable(t: TestController, restaurantName: string) {
    await t.expect(Selector("main table tr").withText(restaurantName).exists).ok()
  }

  static async goToRestaurant(t: TestController, restaurantName: string) {
    await t.click(Selector("main table tr").withText(restaurantName))
  }
}
