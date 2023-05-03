
export default class Navigation {
  static clickRestaurantAndDishesMenuEntry() {
    cy.get("a").contains("Restaurants").click()
  }
}
