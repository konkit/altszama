export default class BalanceView {

  static open() {
    cy.get("a").contains("Balance").click()
    cy.get("h1").contains("Balance")
  }

  static expectNetTotal(text: string) {
    cy.get("[data-cy='balance-overall'] .net").should("contain", text)
  }

  static expectOwedToYou(username: string, amount: string) {
    BalanceView.amountRow("Owed to you", username).should("contain", `+${amount}`)
  }

  static expectYouOwe(username: string, amount: string) {
    BalanceView.amountRow("You owe", username).should("contain", `−${amount}`)
  }

  // Expects at least one other person to be listed
  static expectNotListed(username: string) {
    cy.get("[data-cy='balance-overall'] dt").each($dt => expect($dt.text().trim()).not.to.eq(username))
  }

  static historyRow(restaurantName: string) {
    return cy.get(".history a[mat-list-item]").contains(restaurantName).parents("a[mat-list-item]")
  }

  private static amountRow(groupTitle: string, username: string) {
    return cy.get("[data-cy='balance-overall'] .group-title").contains(groupTitle)
      .next(".amounts").find(".amount-row").contains(username).parents(".amount-row")
  }
}
