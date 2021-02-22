import {Selector} from "testcafe";
import { t } from 'testcafe';


export default class Navigation {
  static async clickRestaurantAndDishesMenuEntry() {
    await t.click(Selector("nav .v-list-item").withText("Restaurants and dishes"))
  }
}
