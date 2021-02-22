import {Selector} from "testcafe";
import { t } from 'testcafe';

export default class RestaurantsListView {

  static async expectNoDataInRestaurantTable() {
    await t.expect(Selector("main table").innerText).contains("No data available")
  }

  static async clickCreateNewRestaurantButton() {
    await t.click(Selector("button").withText("CREATE NEW RESTAURANT"))
  }

  static async expectRestaurantInTable(restaurantName: string) {
    await t.expect(Selector("main table tr").withText(restaurantName).exists).ok()
  }

  static async goToRestaurant(restaurantName: string) {
    await t.click(Selector("main table tr").withText(restaurantName))
  }
}
