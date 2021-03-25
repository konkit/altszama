import {Selector, t} from "testcafe";

export default class ShowRestaurantView {

  static async clickCreateNewDishButton() {
    await t.click(Selector("button").withText("CREATE NEW DISH"))
  }

  static async dishExists(dishName: string, dishPrice: string) {
    await t.expect(this.dishExistsSelector(dishName, dishPrice).exists).ok()
  }

  static async dishNotExists(dishName: string, dishPrice: string) {
    await t.expect(this.dishExistsSelector(dishName, dishPrice).exists).notOk()
  }

  private static dishExistsSelector(dishName: string, dishPrice: string) {
    return Selector("main .v-list-item .v-list-item__title")
        .withText(dishName)
        .withText(dishPrice);
  }

  static async editDish(dishName: string) {
    await t.click(Selector(".v-list-item__title").withText(dishName).parent(".v-list-item").find(".edit-button"))
  }

  static async deleteDish(dishName: string) {
    await t.click(Selector(".v-list-item__title").withText(dishName).parent(".v-list-item").find(".delete-button"))
  }

  static async editRestaurant() {
    await t.click(Selector(".v-btn").withText("EDIT RESTAURANT"))
  }

  static async deleteRestaurant() {
    await t.click(Selector(".v-btn").withText("DELETE RESTAURANT"))
  }
}
