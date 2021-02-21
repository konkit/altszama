import {Selector} from "testcafe";


export default class CreateRestaurantForm {
  static async fillNameField(t: TestController, value: string) {
    let inputSelector = Selector("label").withText("Name").parent().find("input");
    await t.typeText(inputSelector, value)
  }

  static async fillUrlField(t: TestController, value: string) {
    let inputSelector = Selector("label").withText("Url").parent().find("input");
    await t.typeText(inputSelector, value)
  }

  static async clickCreateRestaurantButton(t: TestController) {
    await t.click(Selector("button").withText("CREATE"))
  }
}
