import {Selector} from "testcafe";
import { t } from 'testcafe';

export default class ShowRestaurantView {

  static async clickCreateNewDishButton() {
    await t.click(Selector("button").withText("CREATE NEW DISH"))
  }

  static async dishExists(dishName: string, dishPrice: string) {
    await t.expect(Selector("main .v-list-item .v-list-item__title").exists).ok()
    await t.expect(Selector("main .v-list-item .v-list-item__title").textContent).contains(`${dishName} ( ${dishPrice} zł )`)
  }

  static async dishNotExists(dishName: string, dishPrice: string) {
    await t.expect(Selector("main .v-list-item .v-list-item__title").withText(`${dishName} ( ${dishPrice} zł )`).exists).notOk()
  }

  static async editDish(dishName: string) {
    await t.click(Selector(".v-list-item__title").withText(dishName).parent(".v-list-item").find(".edit-button"))
  }

  static async deleteDish(dishName: string) {
    await t.click(Selector(".v-list-item__title").withText(dishName).parent(".v-list-item").find(".delete-button"))
  }
}
