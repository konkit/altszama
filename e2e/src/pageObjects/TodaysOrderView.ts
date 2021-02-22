import {Selector} from "testcafe";
import { t } from 'testcafe';

export default class TodaysOrderView {

  static async expectNoOrdersMadeYet() {
    await t.expect(Selector("main").innerText).contains("You haven't ordered anything today yet.")
  }

  static async clickAddNewOrderButton() {
    await t.click(Selector("button").withText("ADD NEW ORDER"))
  }
}
