
const TARGET_HOST = Cypress.expose("TARGET_HOST") || "localhost";
const TARGET_PORT = Cypress.expose("TARGET_PORT") || 4200;
const PARENT_URL = `http://${TARGET_HOST}:${TARGET_PORT}`

export default class LoginView {

    static logout() {
      cy.get("a").contains("Logout").click()
    }

    static loginAs(username: string) {
        cy.visit(`${PARENT_URL}/login/test`)
        cy.get("button").contains(username).click();
    }
}
