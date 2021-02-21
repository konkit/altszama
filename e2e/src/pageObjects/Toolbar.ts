import {Selector} from "testcafe";


export default class Toolbar {

  static async toolbarShouldContain(t: TestController, text: string) {
    await t.expect(Selector(".v-toolbar .v-toolbar__title").innerText).contains(text)
  }
}
