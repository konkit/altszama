import axios from "axios";

const TARGET_HOST = process.env.TARGET_HOST || '127.0.0.1'
const TARGET_PORT = process.env.TARGET_PORT

export class TestEnvApi {
  async clearEverything() {
    return await axios.post(`http://${TARGET_HOST}:${TARGET_PORT}/api/e2e/clearEverything`, {})
  }

  async generateTeamAndUsers() {
    return await axios.post(`http://${TARGET_HOST}:${TARGET_PORT}/api/e2e/generateTeamAndUsers`, {})
  }

  async generateEverything() {
    return await axios.post(`http://${TARGET_HOST}:${TARGET_PORT}/api/e2e/generateEverything`, {})
  }

  async generateRestaurantsAndDishes() {
    return await axios.post(`http://${TARGET_HOST}:${TARGET_PORT}/api/e2e/generateRestaurantsAndDishes`, {})
  }
}
