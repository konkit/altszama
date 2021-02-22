import {Selector} from "testcafe";
import { t } from 'testcafe';

export default class Toolbar {

  static async toolbarShouldContain(text: string) {
    await t.expect(Selector(".v-toolbar .v-toolbar__title").innerText).contains(text)
  }

  static async goBack() {
    await t.click(Selector(".v-toolbar .back-button"))
  }
}
