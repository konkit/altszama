import {Selector} from "testcafe";


export default class Navigation {

  static async clickRestaurantAndDishesMenuEntry(t: TestController) {
    await t.click(Selector("nav .v-list-item").withText("Restaurants and dishes"))
  }
}
