package altszama.order.dto

import altszama.auth.User
import altszama.dish.Dish
import altszama.dish.SideDish
import altszama.order.Order
import altszama.orderEntry.DishEntry
import altszama.orderEntry.OrderEntry
import altszama.orderEntry.OrderEntryPaymentStatus
import altszama.restaurant.Restaurant
import org.bson.types.ObjectId
import org.junit.Test
import org.junit.jupiter.api.Assertions.*
import java.time.LocalDate

class ShowResponseTest {

  private val orderCreator = User("orderCreator", "password", "mail@mail.com")

  private val user1 = User("username1", "password", "mail1@mail.com")
  private val user2 = User("username2", "password", "mail2@mail.com")

  private val restaurant = Restaurant(name = "Restaurant1")

  private val dish1 = Dish(restaurant, objectId(), "dish1", 1100)
  private val dish2 = Dish(restaurant, objectId(), "dish2", 1300)
  private val dish3 = Dish(restaurant, objectId(), "dish3", 1500)
  private val dish4 = Dish(restaurant, objectId(), "dish3", 1700)

  private val order = Order(objectId(), restaurant, orderCreator, LocalDate.now())

  private val allDishesInRestaurant = listOf(dish1, dish2, dish3)
  private val allDishesInRestaurantByCategory = hashMapOf("" to listOf(dish1, dish2, dish3))
  private val dishIdToSideDishesMap = emptyMap<String, List<SideDish>>()

  @Test
  fun simpleExampleWithOneEntry() {
    val dishEntry1 = DishEntry(dish1)

    val orderEntry1 = OrderEntry(objectId(), order, user1, listOf(dishEntry1))

    val entriesInThisOrder = listOf(orderEntry1)

    val actual = ShowResponse.create(order, entriesInThisOrder, orderCreator.id, allDishesInRestaurant, dishIdToSideDishesMap)

    val expected = ShowResponse(
        order,
        listOf(
            ShowResponse.Companion.ParticipantsOrderEntry(
                orderEntry1.id,
                user1,
                listOf(
                    ShowResponse.Companion.ParticipantsDishEntry(
                        dishEntry1.id,
                        dish1,
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
        allDishesInRestaurant,
        allDishesInRestaurantByCategory,
        dishIdToSideDishesMap
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

    val dishEntry1 = DishEntry(dish1)
    val dishEntry2 = DishEntry(dish2)
    val dishEntry3 = DishEntry(dish3)
    val dishEntry4 = DishEntry(dish4)

    val orderEntry1 = OrderEntry(objectId(), order, user1, listOf(dishEntry1, dishEntry2))
    val orderEntry2 = OrderEntry(objectId(), order, user2, listOf(dishEntry3, dishEntry4))

    val entriesInThisOrder = listOf(orderEntry1, orderEntry2)

    val actual = ShowResponse.create(
        order,
        entriesInThisOrder,
        orderCreator.id,
        allDishesInRestaurant,
        dishIdToSideDishesMap
    )

    val expected = ShowResponse(
        order,
        listOf(
            ShowResponse.Companion.ParticipantsOrderEntry(
                orderEntry1.id,
                user1,
                listOf(
                    ShowResponse.Companion.ParticipantsDishEntry(
                        dishEntry1.id,
                        dish1,
                        emptyList(),
                        dish1.price,
                        ""
                    ),
                    ShowResponse.Companion.ParticipantsDishEntry(
                        dishEntry2.id,
                        dish2,
                        emptyList(),
                        dish2.price,
                        ""
                    )
                ),
                dish1.price + dish2.price + 500,
                OrderEntryPaymentStatus.UNPAID
            ),
            ShowResponse.Companion.ParticipantsOrderEntry(
                orderEntry2.id,
                user2,
                listOf(
                    ShowResponse.Companion.ParticipantsDishEntry(
                        dishEntry3.id,
                        dish3,
                        emptyList(),
                        dish3.price,
                        ""
                    ),
                    ShowResponse.Companion.ParticipantsDishEntry(
                        dishEntry4.id,
                        dish4,
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
        allDishesInRestaurant,
        allDishesInRestaurantByCategory,
        dishIdToSideDishesMap
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