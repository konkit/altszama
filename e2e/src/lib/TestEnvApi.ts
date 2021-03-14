import axios from "axios";


export class TestEnvApi {
  async clearEverything() {
    return await axios.post("http://localhost:8088/api/e2e/clearEverything", {})
  }

  async generateEverything() {
    return await axios.post("http://localhost:8088/api/e2e/generateEverything", {})
  }

  async generateRestaurantsAndDishes() {
    return await axios.post("http://localhost:8088/api/e2e/generateRestaurantsAndDishes", {})
  }
}
