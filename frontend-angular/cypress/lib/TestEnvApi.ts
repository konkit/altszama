
export class TestEnvApi {

  clearEverything(parentUrl: string) {
    return cy.request("POST", `${parentUrl}/api/e2e/clearEverything`, {})
  }

  generateTeamAndUsers(parentUrl: string) {
    return cy.request("POST", `${parentUrl}/api/e2e/generateTeamAndUsers`, {})
  }

  generateEverything(parentUrl: string) {
    return cy.request("POST", `${parentUrl}/api/e2e/generateEverything`, {})
  }

  generateRestaurantsAndDishes(parentUrl: string) {
    return cy.request("POST", `${parentUrl}/api/e2e/generateRestaurantsAndDishes`, {})
  }

}
