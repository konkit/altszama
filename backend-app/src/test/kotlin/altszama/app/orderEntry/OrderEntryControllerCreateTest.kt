package altszama.app.orderEntry

import altszama.app.dish.Dish
import altszama.app.dish.DishRepository
import altszama.app.dish.DishService
import altszama.app.dish.SideDish
import altszama.app.dish.dto.DishCreateRequest
import altszama.app.order.Order
import altszama.app.order.OrderService
import altszama.app.restaurant.Restaurant
import altszama.app.restaurant.RestaurantService
import altszama.app.restaurant.dto.RestaurantSaveRequest
import altszama.app.team.Team
import altszama.app.test.AbstractIntegrationTest
import altszama.app.test.TestFactoriesService
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

class OrderEntryControllerCreateTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var dishRepository: DishRepository

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var testFactoriesService: TestFactoriesService

  private val sideDish1 = SideDish(name = "Side dish 1", price = 100)
  private val sideDish2 = SideDish(name = "Side dish 2", price = 120)
  private val sideDish3 = SideDish(name = "Side dish 3", price = 150)

  val fakeDishId = "11111111"
  val fakeSideDishId = "111111111111"

  //TODO: New dish/sidedish not created on fail

  @Test()
  fun itShouldAddOrderEntryWithExistingDishAndExistingSidedishSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(order, dish1.id, sideDish1.id!!)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)
    assertThat(orderEntriesInDb[0].dishEntries).hasSize(1)

    val firstDishEntry = orderEntriesInDb[0].dishEntries[0]
    assertThat(firstDishEntry.dish.id).isEqualTo(dish1.id)
    assertThat(firstDishEntry.additionalComments).isEqualTo("Some funny comment")
    assertThat(firstDishEntry.chosenSideDishes).isEqualTo(listOf(sideDish1))
  }

  @Test()
  fun itShouldAddOrderEntryWithExistingDishAndExistingSidedishForUserFromTheSameTeam() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val (user2Token, user2) = testFactoriesService.createUser2WithToken(team1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(order, dish1.id, sideDish1.id!!)
    val request = createRequest(createContent, user2Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)
    assertThat(orderEntriesInDb[0].dishEntries).hasSize(1)
    assertThat(orderEntriesInDb[0].dishEntries[0].dish.id).isEqualTo(dish1.id)
    assertThat(orderEntriesInDb[0].dishEntries[0].additionalComments).isEqualTo("Some funny comment")
    assertThat(orderEntriesInDb[0].dishEntries[0].chosenSideDishes).isEqualTo(listOf(sideDish1))
  }

  @Test()
  fun itShouldAddOrderEntryWithExistingDishAndNewSideDishSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val newSideDishName = "Side dish 4"
    val newSideDishPrice = 200
    val createContent = orderEntryPayloadWithExistingDishAndNewSideDish(order, dish1, newSideDishName, newSideDishPrice)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)
    assertThat(orderEntriesInDb[0].dishEntries).hasSize(1)

    val firstDishEntry = orderEntriesInDb[0].dishEntries[0]
    assertThat(firstDishEntry.dish.id).isEqualTo(dish1.id)
    assertThat(firstDishEntry.additionalComments).isEqualTo("Some funny comment")
    assertThat(firstDishEntry.chosenSideDishes).hasSize(1)
    assertThat(firstDishEntry.chosenSideDishes[0].name).isEqualTo(newSideDishName)
    assertThat(firstDishEntry.chosenSideDishes[0].price).isEqualTo(newSideDishPrice)

    val orderedDishFromDb = dishRepository.findById(firstDishEntry.dish.id).get()
    assertThat(orderedDishFromDb.sideDishes).hasSize(4)
    assertThat(orderedDishFromDb.sideDishes.find { sd -> sd.name == newSideDishName }!!.price).isEqualTo(
      newSideDishPrice
    )
  }

  @Test()
  fun itShouldAddOrderEntryWithNewDishAndNewSideDishSuccessfully() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val newDishName = "New dish"
    val newDishPrice = 2400

    val newSideDishName = "Side dish 4"
    val newSideDishPrice = 200

    val createContent = createPayloadWithNewDishAndNewSideDish(order, dish1, newDishName, newDishPrice, newSideDishName, newSideDishPrice)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)
    assertThat(orderEntriesInDb[0].dishEntries).hasSize(1)

    val firstDishEntry = orderEntriesInDb[0].dishEntries[0]
    assertThat(firstDishEntry.dish.name).isEqualTo(newDishName)
    assertThat(firstDishEntry.dish.price).isEqualTo(newDishPrice)
    assertThat(firstDishEntry.additionalComments).isEqualTo("Some funny comment")
    assertThat(firstDishEntry.chosenSideDishes).hasSize(1)
    assertThat(firstDishEntry.chosenSideDishes[0].name).isEqualTo(newSideDishName)
    assertThat(firstDishEntry.chosenSideDishes[0].price).isEqualTo(newSideDishPrice)

    val orderedDishFromDb = dishRepository.findById(firstDishEntry.dish.id).get()
    assertThat(orderedDishFromDb.name).isEqualTo(newDishName)
    assertThat(orderedDishFromDb.price).isEqualTo(newDishPrice)
    assertThat(orderedDishFromDb.sideDishes).hasSize(1)
    assertThat(orderedDishFromDb.sideDishes[0].name).isEqualTo(newSideDishName)
    assertThat(orderedDishFromDb.sideDishes[0].price).isEqualTo(newSideDishPrice)
  }

  @Test()
  fun itShouldAddOrderEntryIfOrderIsAlreadyOrderedButTheUserIsOrderCreator() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dishesList) = createRestaurantAndTwoDishes(team1)
    val (dish1, dish2) = dishesList
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    testFactoriesService.createOrderEntry(order, dish2, user1, team1)
    orderService.setAsOrdered(order.id, null, currentUser = user1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(order, dish1.id, sideDish1.id!!)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)

    assertThat(orderEntriesInDb[0].dishEntries).hasSize(2)
    val dishEntry = orderEntriesInDb[0].dishEntries.find { de -> de.dish.id == dish1.id}!!
    assertThat(dishEntry.dish.id).isEqualTo(dish1.id)
    assertThat(dishEntry.additionalComments).isEqualTo("Some funny comment")
    assertThat(dishEntry.chosenSideDishes).isEqualTo(listOf(sideDish1))
  }

  @Test()
  fun itShouldNotAddOrderEntryIfOrderIsAlreadyOrdered() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)
    orderService.setAsOrdered(order.id, null, currentUser = user1)

    val (user2Token, user2) = testFactoriesService.createUser2WithToken(team1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(order, dish1.id, sideDish1.id!!)
    val request = createRequest(createContent, user2Token)

    expectBadRequestWithMessage(request, "Order is locked - you cannot modify it now")
  }

  @Test()
  fun itShouldAddOrderEntryIfOrderIsAlreadyDeliveredButTheUserIsOrderCreator() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dishesList) = createRestaurantAndTwoDishes(team1)
    val (dish1, dish2) = dishesList
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    testFactoriesService.createOrderEntry(order, dish2, user1, team1)
    orderService.setAsOrdered(order.id, null, currentUser = user1)
    orderService.setAsDelivered(order.id, currentUser = user1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(order, dish1.id, sideDish1.id!!)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)
    assertThat(orderEntriesInDb[0].dishEntries).hasSize(2)

    val dishEntry = orderEntriesInDb[0].dishEntries.find { de -> de.dish.id == dish1.id}!!
    assertThat(dishEntry.dish.id).isEqualTo(dish1.id)
    assertThat(dishEntry.additionalComments).isEqualTo("Some funny comment")
    assertThat(dishEntry.chosenSideDishes).isEqualTo(listOf(sideDish1))
  }

  @Test()
  fun itShouldNotAddOrderEntryIfOrderIsAlreadyDelivered() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)
    orderService.setAsOrdered(order.id, null, currentUser = user1)
    orderService.setAsDelivered(order.id, currentUser = user1)

    val (user2Token, user2) = testFactoriesService.createUser2WithToken(team1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(order, dish1.id, sideDish1.id!!)
    val request = createRequest(createContent, user2Token)

    expectBadRequestWithMessage(request, "Order is locked - you cannot modify it now")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfOrderIsRejected() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)
    testFactoriesService.createOrderEntry(order, dish1, user1, team1)
    orderService.setAsRejected(order.id, currentUser = user1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(order, dish1.id, sideDish1.id!!)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Order is locked - you cannot modify it now")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfExistingSideDishDoesNotExist() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(order, dish1.id, fakeSideDishId)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Side dish does not exist")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfNewSideDishPriceIsNegative() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)

    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val newSideDishName = "Side dish 4"
    val newSideDishPrice = -200

    val createContent = orderEntryPayloadWithExistingDishAndNewSideDish(order, dish1, newSideDishName, newSideDishPrice)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Side dish price cannot be blank or negative")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfNewSideDishNameIsEmpty() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val newSideDishName = ""
    val newSideDishPrice = 200

    val createContent = orderEntryPayloadWithExistingDishAndNewSideDish(order, dish1, newSideDishName, newSideDishPrice)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Side dish name cannot be blank")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfExistingDishDoesNotExist() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val createContent = createPayloadWithExistingDishAndNoSideDishes(order.id, fakeDishId)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish does not exist")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfExistingDishIdIsNull() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val createContent = createPayloadWithExistingDishAndNoSideDishesButWithNullDishIdField(order.id)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish does not exist")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfNewDishNameIsEmpty() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val newDishName = ""
    val newDishPrice = 2400

    val createContent = createPayloadWithNewDishAndNoSideDishes(order, newDishName, newDishPrice)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish name cannot be blank")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfNewDishPriceIsNegative() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val newDishName = "New dish"
    val newDishPrice = -2400

    val createContent = createPayloadWithNewDishAndNoSideDishes(order, newDishName, newDishPrice)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish price cannot be blank or negative")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfOrderDoesNotExist() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (_, dish1) = createRestaurantAndDish(team1)

    val createContent = createPayloadWithExistingDishAndNoSideDishes(fakeOrderId, dish1.id)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Order does not exist")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfUserHasNoAccessToOrder() {
    val team1 = testFactoriesService.createTeam1()
    val (user1Token, user1) = testFactoriesService.createUser1WithToken(team1)

    val (restaurant, dish1) = createRestaurantAndDish(team1)
    val order = testFactoriesService.createOrder(restaurant, user1, team1)

    val team2 = testFactoriesService.createTeam2()
    val (user2Token, user2) = testFactoriesService.createUser2WithToken(team2)

    val createContent = createPayloadWithExistingDishAndNoSideDishes(order.id, dish1.id)
    val request = createRequest(createContent, user2Token)

    expectBadRequestWithMessage(request, "You have no access to this order")
  }

  private fun createRestaurantAndDish(team1: Team): Pair<Restaurant, Dish> {
    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val dishCreateRequest = DishCreateRequest(
      "Dish 1",
      100,
      category = "Category 1",
      sideDishes = listOf(
        sideDish1,
        sideDish2,
        sideDish3
      )
    )
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest)
    return Pair(restaurant, dish1)
  }

  private fun createRestaurantAndTwoDishes(team1: Team): Pair<Restaurant, Pair<Dish, Dish>> {
    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
    val sideDishesList = listOf(sideDish1, sideDish2, sideDish3)
    val dishCreateRequest1 = DishCreateRequest(
      "Dish 1",
      100,
      category = "Category 1",
      sideDishes = sideDishesList
    )
    val dishCreateRequest2 = DishCreateRequest(
      "Dish 2",
      120,
      category = "Category 1",
      sideDishes = sideDishesList
    )
    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest1)
    val dish2 = dishService.saveDish(team1, restaurant.id, dishCreateRequest2)
    return Pair(restaurant, Pair(dish1, dish2))
  }

  private fun createRequest(createContent: String, user1Token: String): MockHttpServletRequestBuilder {
    return MockMvcRequestBuilders.post("/api/order_entries/save")
      .content(createContent)
      .contentType(MediaType.APPLICATION_JSON)
      .header("Authorization", user1Token)
  }

  private fun orderEntryPayloadWithExistingDishAndNewSideDish(
    order: Order,
    dish1: Dish,
    newSideDishName: String,
    newSideDishPrice: Int
  ): String {
    return """{
          "orderId": "${order.id}",
          "dishId": "${dish1.id}",
          "additionalComments": "Some funny comment",
          "newDish": false,
          "newDishName": "",
          "newDishPrice": 0,
          "sideDishes": [
            {"isNew": true, "newSideDishName": "${newSideDishName}", "newSideDishPrice": "${newSideDishPrice}"}
          ]
      }""".trimIndent()
  }

  private fun createPayloadWithExistingDishAndNoSideDishes(orderId: String, dishId: String): String {
    return """{
          "orderId": "${orderId}",
          "dishId": "${dishId}",
          "additionalComments": "Some funny comment",
          "newDish": false,
          "sideDishes": []
      }""".trimIndent()
  }

  private fun createPayloadWithExistingDishAndNoSideDishesButWithNullDishIdField(orderId: String): String {
    return """{
          "orderId": "${orderId}",
          "dishId": null,
          "additionalComments": "Some funny comment",
          "newDish": false,
          "sideDishes": []
      }""".trimIndent()
  }

  private fun createPayloadWithNewDishAndNoSideDishes(order: Order, newDishName: String, newDishPrice: Int): String {
    return """{
          "orderId": "${order.id}",
          "additionalComments": "Some funny comment",
          "newDish": true,
          "newDishName": "${newDishName}",
          "newDishPrice": "${newDishPrice}",
          "sideDishes": []
      }""".trimIndent()
  }

  private fun createPayloadWithExistingDishAndExistingSideDish(
    order: Order,
    dishId: String,
    sideDishId: String
  ): String {
    return """{
          "orderId": "${order.id}",
          "dishId": "${dishId}",
          "additionalComments": "Some funny comment",
          "newDish": false,
          "newDishName": "",
          "newDishPrice": 0,
          "sideDishes": [
            {"isNew": false, "id": "${sideDishId}"}
          ]
      }""".trimIndent()
  }

  private fun createPayloadWithNewDishAndNewSideDish(
    order: Order,
    dish1: Dish,
    newDishName: String,
    newDishPrice: Int,
    newSideDishName: String,
    newSideDishPrice: Int
  ): String {
    return """{
          "orderId": "${order.id}",
          "dishId": "${dish1.id}",
          "additionalComments": "Some funny comment",
          "newDish": true,
          "newDishName": "${newDishName}",
          "newDishPrice": "${newDishPrice}",
          "sideDishes": [
            {"isNew": true, "newSideDishName": "${newSideDishName}", "newSideDishPrice": "${newSideDishPrice}"}
          ]
      }""".trimIndent()
  }
}