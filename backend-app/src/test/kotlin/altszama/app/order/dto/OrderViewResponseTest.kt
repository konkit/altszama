package altszama.app.order.dto

import altszama.app.auth.User
import altszama.app.dish.Dish
import altszama.app.order.Order
import altszama.app.order.OrderState
import altszama.app.orderEntry.DishEntry
import altszama.app.orderEntry.DishEntryDishData
import altszama.app.orderEntry.OrderEntry
import altszama.app.restaurant.Restaurant
import altszama.app.team.Team
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.LocalDate

internal class OrderViewResponseTest {

  private val team = Team(name = "mail.com", domain = "mail.com", userEmails = emptyList())

  private val orderCreator = User("orderCreator", "password", "mail@mail.com")

  private val user1 = User("username1", "password", "mail1@mail.com")
  private val user2 = User("username2", "password", "mail2@mail.com")

  private val restaurant = Restaurant(team = team, name = "Restaurant1")

  private val dish1 = Dish(restaurant, objectId(), "dish1", 1100)
  private val dish2 = Dish(restaurant, objectId(), "dish2", 1300)
  private val dish3 = Dish(restaurant, objectId(), "dish3", 1500)

  private val order = Order(objectId(), team, restaurant, orderCreator, LocalDate.now())

  @Test
  fun onePersonOrdered() {
    val entriesInThisOrder = listOf(
        OrderEntry(objectId(), order, user1, listOf(DishEntry(DishEntryDishData.fromDish(dish1))))
    )

    val actual = OrderViewInitialData.create(order, entriesInThisOrder)

    val expected = OrderViewInitialData(
        OrderState.CREATED,
        DeliveryData(
        0,
        0,
        0
        ),
        restaurant.name,
        "",
        listOf(
            OrderViewInitialData.Companion.GroupedOrderEntry(
                dish1.name,
                dish1.price,
                1,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user1.username, "", emptyList())
                )
            )
        ),
        1,
        dish1.price,
        dish1.price
    )


    assertEquals(expected, actual)
  }

  @Test
  fun twoPeopleOrdered() {
    val entriesInThisOrder = listOf(
        OrderEntry(objectId(), order, user1, listOf(DishEntry.fromDish(dish1))),
        OrderEntry(objectId(), order, user2, listOf(DishEntry.fromDish(dish2)))
    )

    val actual = OrderViewInitialData.create(order, entriesInThisOrder)

    val expected = OrderViewInitialData(
        OrderState.CREATED,
        DeliveryData(
        0,
        0,
        0
        ),
        restaurant.name,
        "",
        listOf(
            OrderViewInitialData.Companion.GroupedOrderEntry(
                dish1.name,
                dish1.price,
                1,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user1.username, "", emptyList())
                )
            ),
            OrderViewInitialData.Companion.GroupedOrderEntry(
                dish2.name,
                dish2.price,
                1,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user2.username, "", emptyList())
                )
            )
        ),
        2,
        dish1.price + dish2.price,
        dish1.price + dish2.price
    )


    assertEquals(expected, actual)
  }

  @Test
  fun twoPeopleOrderedWithDeliveryPerDish() {
    val deliveryCostPerDish = 100

    val order = order.copy(deliveryCostPerDish = deliveryCostPerDish)

    val entriesInThisOrder = listOf(
        OrderEntry(objectId(), order, user1, listOf(DishEntry.fromDish(dish1), DishEntry.fromDish(dish2))),
        OrderEntry(objectId(), order, user2, listOf(DishEntry.fromDish(dish2), DishEntry.fromDish(dish3)))
    )

    val actual = OrderViewInitialData.create(order, entriesInThisOrder)

    val expected = OrderViewInitialData(
        OrderState.CREATED,
        DeliveryData(
        0,
        0,
        deliveryCostPerDish
        ),
        restaurant.name,
        "",
        listOf(
            OrderViewInitialData.Companion.GroupedOrderEntry(
              dish1.name,
                dish1.price,
                1,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user1.username, "", emptyList())
                )
            ),
            OrderViewInitialData.Companion.GroupedOrderEntry(
              dish2.name,
                2 * dish2.price,
                2,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user1.username, "", emptyList()),
                    OrderViewInitialData.Companion.EatingPersonEntry(user2.username, "", emptyList())
                )
            ),
            OrderViewInitialData.Companion.GroupedOrderEntry(
              dish3.name,
                dish3.price,
                1,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user2.username, "", emptyList())
                )
            )
        ),
        2,
        dish1.price + dish2.price + dish2.price + dish3.price,
        dish1.price + deliveryCostPerDish
            + dish2.price + deliveryCostPerDish
            + dish2.price + deliveryCostPerDish
            + dish3.price + deliveryCostPerDish
    )


    assertEquals(expected.groupedEntries, actual.groupedEntries)
    assertEquals(expected.allEatingPeopleCount, actual.allEatingPeopleCount)
    assertEquals(expected.basePriceSum, actual.basePriceSum)
    assertEquals(expected.totalPrice, actual.totalPrice)
    assertEquals(expected, actual)
  }

  @Test
  fun twoPeopleOrderedWithDeliveryPerAll() {
    val deliveryCostPerAll = 100

    val order = order.copy(deliveryCostPerEverybody = deliveryCostPerAll)

    val entriesInThisOrder = listOf(
        OrderEntry(objectId(), order, user1, listOf(DishEntry.fromDish(dish1))),
        OrderEntry(objectId(), order, user2, listOf(DishEntry.fromDish(dish2)))
    )

    val actual = OrderViewInitialData.create(order, entriesInThisOrder)

    val expected = OrderViewInitialData(
        OrderState.CREATED,
        DeliveryData(
        0,
        deliveryCostPerAll,
        0
        ),
        restaurant.name,
        "", listOf(
        OrderViewInitialData.Companion.GroupedOrderEntry(
          dish1.name,
            dish1.price,
            1,
            listOf(
                OrderViewInitialData.Companion.EatingPersonEntry(user1.username, "", emptyList())
            )
        ),
        OrderViewInitialData.Companion.GroupedOrderEntry(
          dish2.name,
            dish2.price,
            1,
            listOf(
                OrderViewInitialData.Companion.EatingPersonEntry(user2.username, "", emptyList())
            )
        )
    ),
        2,
        dish1.price + dish2.price,
        dish1.price + dish2.price + deliveryCostPerAll
    )


    assertEquals(expected, actual)
  }

  @Test
  fun twoPeopleOrderedWithPercentDecrease() {
    val percentDecrease = 10

    val order = order.copy(decreaseInPercent = percentDecrease)

    val entriesInThisOrder = listOf(
        OrderEntry(objectId(), order, user1, listOf(DishEntry.fromDish(dish1))),
        OrderEntry(objectId(), order, user2, listOf(DishEntry.fromDish(dish2)))
    )

    val actual = OrderViewInitialData.create(order, entriesInThisOrder)

    val expected = OrderViewInitialData(
        OrderState.CREATED,
        DeliveryData(
          percentDecrease,
        0,
        0
        ),
        restaurant.name,
        "",
        listOf(
            OrderViewInitialData.Companion.GroupedOrderEntry(
              dish1.name,
                dish1.price,
                1,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user1.username, "", emptyList())
                )
            ),
            OrderViewInitialData.Companion.GroupedOrderEntry(
              dish2.name,
                dish2.price,
                1,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user2.username, "", emptyList())
                )
            )
        ),
        2,
        dish1.price + dish2.price,
        (dish1.price + dish2.price) * (100 - percentDecrease) / 100
    )

    assertEquals(expected, actual)
  }

  @Test
  fun onePersonOrderedTwoSameDishes() {
    val entriesInThisOrder = listOf(
        OrderEntry(objectId(), order, user1, listOf(DishEntry.fromDish(dish1))),
        OrderEntry(objectId(), order, user1, listOf(DishEntry.fromDish(dish1)))
    )

    val actual = OrderViewInitialData.create(order, entriesInThisOrder)

    val expected = OrderViewInitialData(
        OrderState.CREATED,
        DeliveryData(
        0,
        0,
        0
        ),
        restaurant.name,
        "",
        listOf(
            OrderViewInitialData.Companion.GroupedOrderEntry(
              dish1.name,
                2 * dish1.price,
                2,
                listOf(
                    OrderViewInitialData.Companion.EatingPersonEntry(user1.username, "", emptyList()),
                    OrderViewInitialData.Companion.EatingPersonEntry(user1.username, "", emptyList())
                )
            )
        ),
        2,
        2 * dish1.price,
        2 * dish1.price
    )

    assertEquals(expected, actual)
  }


  private fun objectId(): String = ObjectId.get().toHexString()

}
