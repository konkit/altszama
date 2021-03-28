import {Selector, t} from "testcafe";

export default class OrderingView {

    static async setAsOrdered() {
        await t.click(Selector("button").withText("ORDER PLACED"))
        await t.expect(Selector(".v-toolbar .v-toolbar__title").innerText).match(/^\[ORDERED\].+/)
    }
}