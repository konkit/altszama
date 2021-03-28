import {Selector, t} from "testcafe";

export default class ShowOrderView {

    static async addEntry(dishName: string, dishPrice: string) {
        await t.click(Selector("button").withText("ADD ENTRY"))

        await t.click(Selector("input#newDishName"))
        await t.click(Selector(".v-select-list .v-list-item").withText(dishName))

        await t.click(Selector("button").withText("SUBMIT"))

        await t.expect(Selector(".v-list-item").withText(dishName).withText(dishPrice).exists).ok()
    }

    static async placeOrder() {
        await t.click(Selector("button").withText("PLACE ORDER"))
    }

    static async setAsDelivered() {
        await t.click(Selector("button").withText("MARK AS DELIVERED"))
        await t.expect(Selector(".v-toolbar .v-toolbar__title").innerText).match(/^\[DELIVERED\].+/)
    }
}