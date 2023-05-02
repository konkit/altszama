
export default class TodaysOrderView {

  static expectNoOrdersMadeYet() {
    cy.get("main").should(main => {
      expect(main.get(0).innerText).to.contains("You haven't ordered anything today yet.")
    })
  }

  static clickAddNewOrderButton() {
    cy.get("button").contains("Add new order").click();
  }
}
