import {Selector} from "testcafe";
import { t } from 'testcafe';

export default class CreateDishForm {
  static async fillNameField(value: string) {
    let inputSelector = Selector("label").withText("Name").parent().find("input");
    await t.typeText(inputSelector, value)
  }

  static async fillPriceField(value: string) {
    let inputSelector = Selector("label").withText("Price").parent().find("input");
    await t
      .click(inputSelector)
      .pressKey('ctrl+a delete')
      .typeText(inputSelector, value)
  }

  static async submit() {
    await t.click(Selector("button").withText("CREATE"))
  }

  static async expectValidationError(errorMsg: string) {
    await t.expect(Selector(".v-alert").textContent).contains(errorMsg)
  }

}
