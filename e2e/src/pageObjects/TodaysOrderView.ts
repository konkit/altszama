import {Selector} from "testcafe";


export default class TodaysOrderView {

  static async expectNoOrdersMadeYet(t: TestController) {
    await t.expect(Selector("main").innerText).contains("You haven't ordered anything today yet.")
  }

  static async clickAddNewOrderButton(t: TestController) {
    await t.click(Selector("button").withText("ADD NEW ORDER"))
  }
}
