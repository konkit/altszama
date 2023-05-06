package altszama.app.order.dto

import altszama.app.auth.User
import altszama.app.dish.Dish
import altszama.app.dish.SideDish
import altszama.app.dish.dto.DishDto
import altszama.app.order.Order
import altszama.app.orderEntry.DishEntry
import altszama.app.orderEntry.OrderEntry
import altszama.app.orderEntry.OrderEntryPaymentStatus
import altszama.app.restaurant.Restaurant
import altszama.app.team.Team
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.LocalDate

class ShowOrderResponseTest {

  private val team = Team(name = "mail.com", domain = "mail.com", userEmails = emptyList())

  private val orderCreator = User("orderCreator", "password", "mail@mail.com")

  private val user1 = User("username1", "password", "mail1@mail.com")
  private val user2 = User("username2", "password", "mail2@mail.com")

  private val restaurant = Restaurant(team = team, name = "Restaurant1")

  private val dish1 = Dish(restaurant, objectId(), "dish1", 1100)
  private val dish2 = Dish(restaurant, objectId(), "dish2", 1300)
  private val dish3 = Dish(restaurant, objectId(), "dish3", 1500)
  private val dish4 = Dish(restaurant, objectId(), "dish3", 1700)

  private val order = Order(objectId(), team, restaurant, orderCreator, LocalDate.now())

  private val allDishesInRestaurant = listOf(dish1, dish2, dish3)
  private val allDishesDtosInRestaurant = allDishesInRestaurant.map { d -> DishDto.fromDish(d) }

  private val allDishesInRestaurantByCategory = hashMapOf("" to listOf(dish1, dish2, dish3))
  private val allDishesDtosInRestaurantByCategory = allDishesInRestaurantByCategory.mapValues { entry -> entry.value.map { d -> DishDto.fromDish(d) } }
  private val dishIdToSideDishesMap = emptyMap<String, List<SideDish>>()

  @Test
  fun simpleExampleWithOneEntry() {
    val dishEntry1 = DishEntry.fromDish(dish1)

    val orderEntry1 = OrderEntry(objectId(), order, user1, listOf(dishEntry1))

    val entriesInThisOrder = listOf(orderEntry1)

    val actual = ShowOrderResponse.create(order, entriesInThisOrder, orderCreator.id, allDishesInRestaurant, dishIdToSideDishesMap)

    val expected = ShowOrderResponse(
        ShowOrderResponse.fromOrder(order),
        listOf(
            ParticipantsOrderEntry(
                orderEntry1.id,
                user1.id,
                user1.username,
                listOf(
                    ParticipantsDishEntry(
                        dishEntry1.id,
                        dish1.id,
                        dish1.name,
                        emptyList(),
                        dish1.price,
                        ""
                    )
                ),
                dish1.price,
                OrderEntryPaymentStatus.UNPAID
            )
        ),
        orderCreator.id,
        allDishesDtosInRestaurant,
        allDishesDtosInRestaurantByCategory,
        dishIdToSideDishesMap,
        1100,
        1100
    )


    assertEquals(expected.order, actual.order)
    assertEquals(expected.orderEntries, actual.orderEntries)
    assertEquals(expected.currentUserId, actual.currentUserId)
    assertEquals(expected.allDishesInRestaurant, actual.allDishesInRestaurant)
    assertEquals(expected.allDishesByCategory, actual.allDishesByCategory)
    assertEquals(expected.dishIdToSideDishesMap, actual.dishIdToSideDishesMap)
    assertEquals(expected, actual)
  }

  @Test
  fun twoPeopleWithDeliveryCostPerAll() {
    val order = order.copy(deliveryCostPerEverybody = 1000)

    val dishEntry1 = DishEntry.fromDish(dish1)
    val dishEntry2 = DishEntry.fromDish(dish2)
    val dishEntry3 = DishEntry.fromDish(dish3)
    val dishEntry4 = DishEntry.fromDish(dish4)

    val orderEntry1 = OrderEntry(objectId(), order, user1, listOf(dishEntry1, dishEntry2))
    val orderEntry2 = OrderEntry(objectId(), order, user2, listOf(dishEntry3, dishEntry4))

    val entriesInThisOrder = listOf(orderEntry1, orderEntry2)

    val actual = ShowOrderResponse.create(
        order,
        entriesInThisOrder,
        orderCreator.id,
        allDishesInRestaurant,
        dishIdToSideDishesMap
    )

    val expected = ShowOrderResponse(
        ShowOrderResponse.fromOrder(order),
        listOf(
            ParticipantsOrderEntry(
                orderEntry1.id,
                user1.id,
                user1.username,
                listOf(
                    ParticipantsDishEntry(
                        dishEntry1.id,
                        dish1.id,
                        dish1.name,
                        emptyList(),
                        dish1.price,
                        ""
                    ),
                    ParticipantsDishEntry(
                        dishEntry2.id,
                        dish2.id,
                        dish2.name,
                        emptyList(),
                        dish2.price,
                        ""
                    )
                ),
                dish1.price + dish2.price + 500,
                OrderEntryPaymentStatus.UNPAID
            ),
            ParticipantsOrderEntry(
                orderEntry2.id,
                user2.id,
                user2.username,
                listOf(
                    ParticipantsDishEntry(
                        dishEntry3.id,
                        dish3.id,
                        dish3.name,
                        emptyList(),
                        dish3.price,
                        ""
                    ),
                    ParticipantsDishEntry(
                        dishEntry4.id,
                        dish4.id,
                        dish4.name,
                        emptyList(),
                        dish4.price,
                        ""
                    )
                ),
                dish3.price + dish4.price + 500,
                OrderEntryPaymentStatus.UNPAID
            )
        ),
        orderCreator.id,
        allDishesDtosInRestaurant,
        allDishesDtosInRestaurantByCategory,
        dishIdToSideDishesMap,
        5600,
        6600
    )


    assertEquals(expected.order, actual.order)
    assertEquals(expected.orderEntries, actual.orderEntries)
    assertEquals(expected.currentUserId, actual.currentUserId)
    assertEquals(expected.allDishesInRestaurant, actual.allDishesInRestaurant)
    assertEquals(expected.allDishesByCategory, actual.allDishesByCategory)
    assertEquals(expected.dishIdToSideDishesMap, actual.dishIdToSideDishesMap)
    assertEquals(expected, actual)
  }

  @Test
  fun twoPeopleWithDeliveryCostPerDish() {
    val order = order.copy(deliveryCostPerDish = 100)

    val dishEntry1 = DishEntry.fromDish(dish1)
    val dishEntry2 = DishEntry.fromDish(dish2)
    val dishEntry3 = DishEntry.fromDish(dish3)
    val dishEntry4 = DishEntry.fromDish(dish4)

    val orderEntry1 = OrderEntry(objectId(), order, user1, listOf(dishEntry1, dishEntry2))
    val orderEntry2 = OrderEntry(objectId(), order, user2, listOf(dishEntry3, dishEntry4))

    val entriesInThisOrder = listOf(orderEntry1, orderEntry2)

    val actual = ShowOrderResponse.create(
        order,
        entriesInThisOrder,
        orderCreator.id,
        allDishesInRestaurant,
        dishIdToSideDishesMap
    )

    val expected = ShowOrderResponse(
        ShowOrderResponse.fromOrder(order),
        listOf(
            ParticipantsOrderEntry(
                orderEntry1.id,
                user1.id,
                user1.username,
                listOf(
                    ParticipantsDishEntry(
                        dishEntry1.id,
                        dish1.id,
                        dish1.name,
                        emptyList(),
                        dish1.price,
                        ""
                    ),
                    ParticipantsDishEntry(
                        dishEntry2.id,
                        dish2.id,
                        dish2.name,
                        emptyList(),
                        dish2.price,
                        ""
                    )
                ),
                dish1.price + dish2.price + 200,
                OrderEntryPaymentStatus.UNPAID
            ),
            ParticipantsOrderEntry(
                orderEntry2.id,
                user2.id,
                user2.username,
                listOf(
                    ParticipantsDishEntry(
                        dishEntry3.id,
                        dish3.id,
                        dish3.name,
                        emptyList(),
                        dish3.price,
                        ""
                    ),
                    ParticipantsDishEntry(
                        dishEntry4.id,
                        dish4.id,
                        dish4.name,
                        emptyList(),
                        dish4.price,
                        ""
                    )
                ),
                dish3.price + dish4.price + 200,
                OrderEntryPaymentStatus.UNPAID
            )
        ),
        orderCreator.id,
        allDishesDtosInRestaurant,
        allDishesDtosInRestaurantByCategory,
        dishIdToSideDishesMap,
        5600,
        6000
    )


    assertEquals(expected.order, actual.order)
    assertEquals(expected.orderEntries, actual.orderEntries)
    assertEquals(expected.currentUserId, actual.currentUserId)
    assertEquals(expected.allDishesInRestaurant, actual.allDishesInRestaurant)
    assertEquals(expected.allDishesByCategory, actual.allDishesByCategory)
    assertEquals(expected.dishIdToSideDishesMap, actual.dishIdToSideDishesMap)
    assertEquals(expected, actual)
  }


  private fun objectId(): String = ObjectId.get().toHexString()


}
