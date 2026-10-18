export default class OrderingView {
    static setAsOrdered() {
      cy.get("button").contains("Mark as ordered").click()
      cy.get("[data-cy='order-status-chip']").contains("Waiting for delivery")
    }
}
