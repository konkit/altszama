import {Selector} from "testcafe";
import { t } from 'testcafe';
import TodaysOrderView from "./TodaysOrderView";
import Toolbar from "./Toolbar";

export default class CreateOrderView {

  static async expectNoRestaurantsAlert() {
    await t.expect(Selector("main h1").innerText).contains("There are no restaurants, please create one first")
  }

  static async createOrderWithDefaultValues(restaurantName: string) {
    await TodaysOrderView.clickAddNewOrderButton();

    await Toolbar.toolbarShouldContain("Create new order");

    await t.click(Selector(".v-list-item").withText(restaurantName))

    await t.click(Selector("button").withText("CONTINUE"))

    await t.click(Selector("button").withText("CREATE"))

    await t.expect(Selector(".v-list-item").withText(restaurantName).withText("created by John Doe").exists).ok()
  }

  static async goToOrder(restaurantName: string) {
    await t.click(Selector(".v-list-item").withText(restaurantName))
  }

}
