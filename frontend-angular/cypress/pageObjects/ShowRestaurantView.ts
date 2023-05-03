
export default class ShowRestaurantView {

  static expectCorrectRestaurantName(restaurantName: string) {
    cy.get("h1").contains(`Restaurant ${restaurantName}`)
  }

  static async clickCreateNewDishButton() {
    cy.get("button").contains("Create new dish").click()
  }

  static dishExists(dishName: string, dishPrice: string) {
    cy.get("app-dish-entry").should("contain", dishName).and("contain", dishPrice)
  }

  static dishNotExists(dishName: string, dishPrice: string) {
    cy.contains(dishName).should("not.exist")
  }

  static editDish(dishName: string) {
    cy.get("app-dish-entry").contains(dishName).parents("app-dish-entry").find("[data-cy='edit-dish-button']").click()
  }

  static deleteDish(dishName: string) {
    cy.get("app-dish-entry").contains(dishName).parents("app-dish-entry").find("[data-cy='delete-dish-button']").click()
    cy.get("app-delete-confirmation-modal").find("button").contains("Delete").click()
  }

  static editRestaurant() {
    cy.get("button").contains("Edit restaurant").click();
  }

  static async deleteRestaurant() {
    cy.get("button").contains("Delete restaurant").click();
    cy.get("app-delete-confirmation-modal").find("button").contains("Delete").click()
  }
}
