import {Selector, t} from "testcafe";

const TARGET_PORT = process.env.TARGET_PORT;
const PARENT_URL = `http://localhost:${TARGET_PORT}`

export default class LoginView {

    static async logout() {
        await t.click(Selector("nav .v-list-item").withText("Logout"))
    }

    static async loginAs(username: string) {
        await t.navigateTo(`${PARENT_URL}/login/test`)
        await t.click(Selector("button").withText(username.toUpperCase()))
    }
}