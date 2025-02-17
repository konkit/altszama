export default class OrderingView {
    static setAsOrdered() {
      cy.get("button").contains("Order placed!").click()
      cy.get("[data-cy='order-status-chip']").contains("WAITING FOR DELIVERY")
    }
}
