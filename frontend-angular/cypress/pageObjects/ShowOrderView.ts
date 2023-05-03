export default class ShowOrderView {

    static placeOrder() {
        cy.get("button").contains("Place order").click()
    }

    static async setAsDelivered() {
        cy.get("button").contains("Mark as delivered").click()
        cy.get("[data-cy='order-status-chip']").contains("DELIVERED")
    }

    static addEntry(username: string, dishName: string, dishPrice: string) {
        cy.get("button").contains("Add entry").click()
        cy.get("input[data-cy=dish-input]").click()
        cy.contains(dishName).click()
        cy.get("button").contains("Submit").click()

        cy.get("[data-cy='existing-order-entry']")
          .should("contain", dishName)
          .and("contain", dishPrice)
          .and("contain", username)
    }

    static async addCustomEntry(username: string, dishName: string, dishPrice: string) {
        cy.get("button").contains("Add entry").click()
        cy.get("input[data-cy=dish-input]").type(dishName)
        cy.get("app-money-input[data-cy=price-input]").clear().type(dishPrice)
        cy.get("button").contains("Submit").click()

        cy.get("[data-cy='existing-order-entry']")
          .should("contain", dishName)
          .and("contain", dishPrice)
          .and("contain", username)
    }
}
