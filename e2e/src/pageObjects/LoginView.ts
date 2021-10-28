import {Selector, t} from "testcafe";

const TARGET_HOST = process.env.TARGET_HOST || "127.0.0.1";
const TARGET_PORT = process.env.TARGET_PORT;
const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

export default class LoginView {

    static async logout() {
        await t.click(Selector("nav .v-list-item").withText("Logout"))
    }

    static async loginAs(username: string) {
        await t.navigateTo(`${PARENT_URL}/login/test`)
        await t.click(Selector("button").withText(username.toUpperCase()))
    }
}
