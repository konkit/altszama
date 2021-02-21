import {Selector} from "testcafe";


export default class ShowRestaurantView {

  static async clickCreateNewDishButton(t: TestController) {
    await t.click(Selector("button").withText("CREATE NEW DISH"))
  }

  static async dishExists(t: TestController, dishName: string, dishPrice: string) {
    await t.expect(Selector("main .v-list-item .v-list-item__title").exists).ok()
    await t.expect(Selector("main .v-list-item .v-list-item__title").textContent).contains(`${dishName} ( ${dishPrice} zł )`)
  }

}
