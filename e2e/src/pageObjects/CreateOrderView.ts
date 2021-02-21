import {Selector} from "testcafe";


export default class CreateOrderView {

  static async expectNoRestaurantsAlert(t: TestController) {
    await t.expect(Selector("main h1").innerText).contains("There are no restaurants, please create one first")
  }
}
