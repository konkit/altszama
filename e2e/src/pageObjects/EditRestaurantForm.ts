import {Selector} from "testcafe";
import { t } from 'testcafe';


export default class EditRestaurantForm {

  static async fillNameField(value: string) {
    let inputSelector = Selector("label").withText("Name").parent().find("input");
    await t
      .click(inputSelector)
      .pressKey('ctrl+a delete')
      .typeText(inputSelector, value)
  }

  static async fillUrlField(value: string) {
    let inputSelector = Selector("label").withText("Url").parent().find("input");
    await t
      .click(inputSelector)
      .pressKey('ctrl+a delete')
      .typeText(inputSelector, value)
  }

  static async submit() {
    await t.click(Selector("button").withText("UPDATE"))
  }
}
