package altszama.app.orderEntry

import altszama.app.dish.Dish
import altszama.app.dish.DishRepository
import altszama.app.dish.DishService
import altszama.app.order.OrderService
import altszama.app.restaurant.RestaurantService
import altszama.app.team.TeamService
import altszama.app.test.AbstractIntegrationTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

class OrderEntryControllerUpdateTest : AbstractIntegrationTest() {

  @Autowired
  private lateinit var teamService: TeamService

  @Autowired
  private lateinit var restaurantService: RestaurantService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var orderService: OrderService

  @Autowired
  private lateinit var orderEntryService: OrderEntryService

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var dishRepository: DishRepository

  @Autowired
  private lateinit var mockMvc: MockMvc

//  private val sideDish1 = SideDish(name = "Side dish 1", price = 100)
//  private val sideDish2 = SideDish(name = "Side dish 2", price = 120)
//  private val sideDish3 = SideDish(name = "Side dish 3", price = 150)

  val fakeDishId = "11111111"
  val fakeDishEntryId = "11111111"
  val fakeSideDishId = "111111111111"

  //TODO: New dish/sidedish not created on fail

  @Test()
  fun itShouldUpdateOrderEntryWithExistingDishAndExistingSidedishSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val createContent =
      createPayloadWithExistingDishAndExistingSideDish(orderEntry.id, dishEntry.id, dishes[1].id, dishes[1].sideDishes[0].id!!)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)
    assertThat(orderEntriesInDb[0].dishEntries).hasSize(1)

    val firstDishEntry = orderEntriesInDb[0].dishEntries[0]
    assertThat(firstDishEntry.dish.id).isEqualTo(dishes[1].id)
    assertThat(firstDishEntry.additionalComments).isEqualTo("Some updated comment")
    assertThat(firstDishEntry.chosenSideDishes).isEqualTo(listOf(dishes[1].sideDishes[0]))
  }

  @Test()
  fun itShouldNotUpdateOrderEntryIfUserIsDifferentButFromTheSameTeam() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val (user2Token, user2) = createUserAndGetToken("James2", "james2@team1.com")
    val createContent =
      createPayloadWithExistingDishAndExistingSideDish(orderEntry.id, dishEntry.id, dishes[1].id, dishes[1].sideDishes[0].id!!)
    val request = createRequest(createContent, user2Token)

    expectBadRequestWithMessage(request, "You have no access to this order entry")
  }

  @Test()
  fun itShouldUpdateOrderEntryWithExistingDishAndNewSideDishSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val newSideDishName = "Side dish 4"
    val newSideDishPrice = 200
    val createContent =
      orderEntryPayloadWithExistingDishAndNewSideDish(orderEntry.id, dishEntry.id, dishes[1], newSideDishName, newSideDishPrice)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)
    assertThat(orderEntriesInDb[0].dishEntries).hasSize(1)

    val firstDishEntry = orderEntriesInDb[0].dishEntries[0]
    assertThat(firstDishEntry.dish.id).isEqualTo(dishes[1].id)
    assertThat(firstDishEntry.additionalComments).isEqualTo("Some updated comment")
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
  fun itShouldUpdateOrderEntryWithNewDishAndNewSideDishSuccessfully() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val newDishName = "New dish"
    val newDishPrice = 2400

    val newSideDishName = "Side dish 4"
    val newSideDishPrice = 200

    val createContent = createPayloadWithNewDishAndNewSideDish(orderEntry.id, dishEntry.id, newDishName, newDishPrice, newSideDishName, newSideDishPrice)
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
    assertThat(firstDishEntry.additionalComments).isEqualTo("Some updated comment")
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
  fun itShouldUpdateOrderEntryIfOrderIsAlreadyOrderedButTheUserIsOrderCreator() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    orderService.setAsOrdered(order.id, null, currentUser = user1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(orderEntry.id, dishEntry.id, dishes[1].id, dishes[1].sideDishes[0].id!!)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)

    assertThat(orderEntriesInDb[0].dishEntries).hasSize(1)
    val dishEntryFromDb = orderEntriesInDb[0].dishEntries[0]
    assertThat(dishEntryFromDb.dish.id).isEqualTo(dishes[1].id)
    assertThat(dishEntryFromDb.additionalComments).isEqualTo("Some updated comment")
    assertThat(dishEntryFromDb.chosenSideDishes).isEqualTo(listOf(dishes[1].sideDishes[0]))
  }

  @Test()
  fun itShouldNotUpdateOrderEntryIfOrderIsAlreadyOrdered() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    orderService.setAsOrdered(order.id, null, currentUser = user1)

    val (user2Token, user2) = createUserAndGetToken("James2", "james2@team1.com")

    val createContent = createPayloadWithExistingDishAndExistingSideDish(orderEntry.id, dishEntry.id, dishes[1].id, dishes[1].sideDishes[0].id!!)
    val request = createRequest(createContent, user2Token)

    expectBadRequestWithMessage(request, "You have no access to this order entry")
  }

  @Test()
  fun itShouldUpdateOrderEntryIfOrderIsAlreadyDeliveredButTheUserIsOrderCreator() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()
    orderService.setAsOrdered(order.id, null, currentUser = user1)
    orderService.setAsDelivered(order.id, currentUser = user1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(orderEntry.id, dishEntry.id, dishes[1].id, dishes[1].sideDishes[0].id!!)
    val request = createRequest(createContent, user1Token)

    mockMvc.perform(request)
      .andExpect(MockMvcResultMatchers.status().isOk)

    val orderEntriesInDb = orderEntryRepository.findByOrderId(order.id)

    assertThat(orderEntriesInDb).hasSize(1)
    assertThat(orderEntriesInDb[0].order.id).isEqualTo(order.id)
    assertThat(orderEntriesInDb[0].dishEntries).hasSize(1)

    val dishEntryFromDb = orderEntriesInDb[0].dishEntries[0]
    assertThat(dishEntryFromDb.dish.id).isEqualTo(dishes[1].id)
    assertThat(dishEntryFromDb.additionalComments).isEqualTo("Some updated comment")
    assertThat(dishEntryFromDb.chosenSideDishes).isEqualTo(listOf(dishes[1].sideDishes[0]))
  }

  @Test()
  fun itShouldNotUpdateOrderEntryIfOrderIsAlreadyDelivered() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    orderService.setAsOrdered(order.id, null, currentUser = user1)
    orderService.setAsDelivered(order.id, currentUser = user1)

    val (user2Token, user2) = createUserAndGetToken("James2", "james2@team1.com")

    val createContent = createPayloadWithExistingDishAndExistingSideDish(orderEntry.id, dishEntry.id, dishes[1].id, dishes[1].sideDishes[0].id!!)
    val request = createRequest(createContent, user2Token)

    expectBadRequestWithMessage(request, "You have no access to this order entry")
  }

  @Test()
  fun itShouldNotUpdateOrderEntryIfOrderIsRejected() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    orderService.setAsRejected(order.id, currentUser = user1)

    val createContent = createPayloadWithExistingDishAndExistingSideDish(orderEntry.id, dishEntry.id, dishes[1].id, dishes[1].sideDishes[0].id!!)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Order is locked - you cannot modify it now")
  }

  @Test()
  fun itShouldNotUpdateOrderEntryIfExistingSideDishDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val createContent = createPayloadWithExistingDishAndExistingSideDish(orderEntry.id, dishEntry.id, dishes[1].id, fakeSideDishId)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Side dish does not exist")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfNewSideDishPriceIsNegative() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val newSideDishName = "Side dish 4"
    val newSideDishPrice = -200

    val createContent = orderEntryPayloadWithExistingDishAndNewSideDish(orderEntry.id, dishEntry.id, dishes[1], newSideDishName, newSideDishPrice)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Side dish price cannot be blank or negative")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfNewSideDishNameIsEmpty() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val newSideDishName = ""
    val newSideDishPrice = 200

    val createContent = orderEntryPayloadWithExistingDishAndNewSideDish(orderEntry.id, dishEntry.id, dishes[1], newSideDishName, newSideDishPrice)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Side dish name cannot be blank")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfExistingDishDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val createContent = createPayloadWithExistingDishAndNoSideDishes(orderEntry.id, dishEntry.id, fakeDishId)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish does not exist")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfExistingDishIdIsNull() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val createContent = createPayloadWithExistingDishAndNoSideDishesButWithNullDishIdField(orderEntry.id, dishEntry.id)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish does not exist")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfExistingDishEntryIdIsNull() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val createContent = createPayloadWithExistingDishAndNoSideDishesButWithNullDishEntryIdField(orderEntry.id, dishEntry.dish.id)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Field dishEntryId is invalid")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfNewDishNameIsEmpty() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val newDishName = ""
    val newDishPrice = 2400

    val createContent = createPayloadWithNewDishAndNoSideDishes(orderEntry.id, dishEntry.id, newDishName, newDishPrice)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish name cannot be blank")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfNewDishPriceIsNegative() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val newDishName = "New dish"
    val newDishPrice = -2400

    val createContent = createPayloadWithNewDishAndNoSideDishes(orderEntry.id, dishEntry.id, newDishName, newDishPrice)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish price cannot be blank or negative")
  }

  @Test()
  fun itShouldNotUpdateOrderEntryIfOrderEntryDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)

    val createContent = createPayloadWithExistingDishAndNoSideDishes(fakeOrderId, fakeDishEntryId, fakeDishId)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Order entry does not exist")
  }


  @Test()
  fun itShouldNotUpdateOrderEntryIfDishEntryDoesNotExist() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)

    val createContent = createPayloadWithExistingDishAndNoSideDishes(orderEntry.id, fakeDishEntryId, dishes[1].id)
    val request = createRequest(createContent, user1Token)

    expectBadRequestWithMessage(request, "Dish entry does not exist")
  }

  @Test()
  fun itShouldNotAddOrderEntryIfUserHasNoAccessToOrder() {
    val team1 = teamService.createTeam("team1.com", "team1.com")
    val (user1Token, user1) = createUserAndGetToken("James1", "james1@team1.com")

    val (restaurant, dishes) = createRestaurantAndDishes(team1)
    val order = createOrder(restaurant, user1, team1)
    val orderEntry = createOrderEntry(order, dishes[0], user1, team1)
    val dishEntry = orderEntry.dishEntries.first()

    val team2 = teamService.createTeam("team2.com", "team2.com")
    val (user2Token, user2) = createUserAndGetToken("James2", "james2@team2.com")

    val createContent = createPayloadWithExistingDishAndNoSideDishes(orderEntry.id, dishEntry.id, dishes[1].id)
    val request = createRequest(createContent, user2Token)

    expectBadRequestWithMessage(request, "You have no access to this order entry")
  }


  private fun createRequest(createContent: String, userToken: String): MockHttpServletRequestBuilder {
    return MockMvcRequestBuilders.put("/api/order_entries/update")
      .content(createContent)
      .contentType(MediaType.APPLICATION_JSON)
      .header("Authorization", userToken)
  }

//  private fun createOrder(restaurant: Restaurant, user1: User, team1: Team): Order {
//    val orderSaveRequest = OrderSaveRequest(
//      restaurantId = restaurant.id,
//      orderDate = LocalDate.now(),
//      timeOfOrder = LocalTime.of(14, 0),
//      deliveryData = DeliveryData(),
//      paymentData = PaymentData()
//    )
//    return orderService.saveOrder(orderSaveRequest, currentUser = user1, currentUserTeam = team1)
//  }

//  private fun createRestaurantAndDishes(team1: Team): Pair<Restaurant, List<Dish>> {
//    val restaurant = restaurantService.createRestaurant(team1, RestaurantSaveRequest("Restaurant 1"))
//    val sideDishesList = listOf(sideDish1, sideDish2, sideDish3)
//    val dishCreateRequest1 = DishCreateRequest(
//      "Dish 1",
//      100,
//      category = "Category 1",
//      sideDishes = sideDishesList
//    )
//    val dish1 = dishService.saveDish(team1, restaurant.id, dishCreateRequest1)
//    val dishCreateRequest2 = DishCreateRequest(
//      "Dish 2",
//      120,
//      category = "Category 1",
//      sideDishes = sideDishesList
//    )
//    val dish2 = dishService.saveDish(team1, restaurant.id, dishCreateRequest2)
//    return Pair(restaurant, listOf(dish1, dish2))
//  }

  private fun orderEntryPayloadWithExistingDishAndNewSideDish(
    orderEntryId: String,
    dishEntryId: String,
    dish1: Dish,
    newSideDishName: String,
    newSideDishPrice: Int
  ): String {
    return """{
          "id": "${orderEntryId}",
          "dishEntryId": "${dishEntryId}",
          "dishId": "${dish1.id}",
          "additionalComments": "Some updated comment",
          "newDish": false,
          "newDishName": "",
          "newDishPrice": 0,
          "sideDishes": [
            {"isNew": true, "newSideDishName": "${newSideDishName}", "newSideDishPrice": "${newSideDishPrice}"}
          ]
      }""".trimIndent()
  }

  private fun createPayloadWithExistingDishAndNoSideDishes(
    orderEntryId: String,
    dishEntryId: String,
    dishId: String
  ): String {
    return """{
          "id": "${orderEntryId}",
          "dishEntryId": "${dishEntryId}",
          "dishId": "${dishId}",
          "additionalComments": "Some updated comment",
          "newDish": false,
          "sideDishes": []
      }""".trimIndent()
  }

  private fun createPayloadWithExistingDishAndNoSideDishesButWithNullDishIdField(orderEntryId: String,
                                                                                 dishEntryId: String): String {
    return """{
          "id": "${orderEntryId}",
          "dishEntryId": "${dishEntryId}",
          "dishId": null,
          "additionalComments": "Some funny comment",
          "newDish": false,
          "sideDishes": []
      }""".trimIndent()
  }

  private fun createPayloadWithExistingDishAndNoSideDishesButWithNullDishEntryIdField(orderEntryId: String,
                                                                                 dishId: String): String {
    return """{
          "id": "${orderEntryId}",
          "dishEntryId": null,
          "dishId": "${dishId}",
          "additionalComments": "Some funny comment",
          "newDish": false,
          "sideDishes": []
      }""".trimIndent()
  }

  private fun createPayloadWithNewDishAndNoSideDishes(
    orderEntryId: String,
    dishEntryId: String,
    newDishName: String,
    newDishPrice: Int
  ): String {
    return """{
          "id": "${orderEntryId}",
          "dishEntryId": "${dishEntryId}",
          "additionalComments": "Some updated comment",
          "newDish": true,
          "newDishName": "${newDishName}",
          "newDishPrice": "${newDishPrice}",
          "sideDishes": []
      }""".trimIndent()
  }

  private fun createPayloadWithExistingDishAndExistingSideDish(
    orderEntryId: String,
    dishEntryId: String,
    dishId: String,
    sideDishId: String
  ): String {
    return """{
          "id": "${orderEntryId}",
          "dishEntryId": "${dishEntryId}",
          "dishId": "${dishId}",
          "additionalComments": "Some updated comment",
          "newDish": false,
          "newDishName": "",
          "newDishPrice": 0,
          "sideDishes": [
            {"isNew": false, "id": "${sideDishId}"}
          ]
      }""".trimIndent()
  }

  private fun createPayloadWithNewDishAndNewSideDish(
    orderEntryId: String,
    dishEntryId: String,
    newDishName: String,
    newDishPrice: Int,
    newSideDishName: String,
    newSideDishPrice: Int
  ): String {
    return """{
          "id": "${orderEntryId}",
          "dishEntryId": "${dishEntryId}",
          "additionalComments": "Some updated comment",
          "newDish": true,
          "newDishName": "${newDishName}",
          "newDishPrice": "${newDishPrice}",
          "sideDishes": [
            {"isNew": true, "newSideDishName": "${newSideDishName}", "newSideDishPrice": "${newSideDishPrice}"}
          ]
      }""".trimIndent()
  }
}