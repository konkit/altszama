import {Selector} from "testcafe";
import { t } from 'testcafe';

export default class CreateOrderView {

  static async expectNoRestaurantsAlert() {
    await t.expect(Selector("main h1").innerText).contains("There are no restaurants, please create one first")
  }
}
