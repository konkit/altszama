package altszama.order.dto

import altszama.auth.User
import altszama.dish.Dish
import altszama.order.Order
import altszama.orderEntry.DishEntry
import altszama.orderEntry.OrderEntry
import altszama.restaurant.Restaurant
import org.junit.jupiter.api.Assertions.*
import org.bson.types.ObjectId
import org.junit.Test
import java.time.LocalDate

internal class OrderViewResponseTest {


  private val orderCreator = User("orderCreator", "password", "mail@mail.com")

  private val user1 = User("username1", "password", "mail1@mail.com")
  private val user2 = User("username2", "password", "mail2@mail.com")

  private val restaurant = Restaurant(name = "Restaurant1")

  private val dish1 = Dish(restaurant, objectId(), "dish1", 1100)
  private val dish2 = Dish(restaurant, objectId(), "dish2", 1300)
  private val dish3 = Dish(restaurant, objectId(), "dish3", 1500)

  private val order = Order(objectId(), restaurant, orderCreator, LocalDate.now())

  @Test
  fun onePersonOrdered() {
    val entriesInThisOrder = listOf(
        OrderEntry(objectId(), order, user1, listOf(DishEntry(dish1)))
    )

    val actual = OrderViewResponse.create(order, entriesInThisOrder)

    val expected = OrderViewResponse(
        order,
        listOf(
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish1,
                dish1.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user1, "", emptyList())
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
        OrderEntry(objectId(), order, user1, listOf(DishEntry(dish1))),
        OrderEntry(objectId(), order, user2, listOf(DishEntry(dish2)))
    )

    val actual = OrderViewResponse.create(order, entriesInThisOrder)

    val expected = OrderViewResponse(
        order,
        listOf(
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish1,
                dish1.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user1, "", emptyList())
                )
            ),
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish2,
                dish2.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user2, "", emptyList())
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
        OrderEntry(objectId(), order, user1, listOf(DishEntry(dish1), DishEntry(dish2))),
        OrderEntry(objectId(), order, user2, listOf(DishEntry(dish2), DishEntry(dish3)))
    )

    val actual = OrderViewResponse.create(order, entriesInThisOrder)

    val expected = OrderViewResponse(
        order,
        listOf(
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish1,
                dish1.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user1, "", emptyList())
                )
            ),
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish2,
                2 * dish2.price,
                2,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user1, "", emptyList()),
                    OrderViewResponse.Companion.EatingPersonEntry(user2, "", emptyList())
                )
            ),
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish3,
                dish3.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user2, "", emptyList())
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


    assertEquals(expected.order, actual.order)
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
        OrderEntry(objectId(), order, user1, listOf(DishEntry(dish1))),
        OrderEntry(objectId(), order, user2, listOf(DishEntry(dish2)))
    )

    val actual = OrderViewResponse.create(order, entriesInThisOrder)

    val expected = OrderViewResponse(
        order,
        listOf(
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish1,
                dish1.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user1, "", emptyList())
                )
            ),
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish2,
                dish2.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user2, "", emptyList())
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
        OrderEntry(objectId(), order, user1, listOf(DishEntry(dish1))),
        OrderEntry(objectId(), order, user2, listOf(DishEntry(dish2)))
    )

    val actual = OrderViewResponse.create(order, entriesInThisOrder)

    val expected = OrderViewResponse(
        order,
        listOf(
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish1,
                dish1.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user1, "", emptyList())
                )
            ),
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish2,
                dish2.price,
                1,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user2, "", emptyList())
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
        OrderEntry(objectId(), order, user1, listOf(DishEntry(dish1))),
        OrderEntry(objectId(), order, user1, listOf(DishEntry(dish1)))
    )

    val actual = OrderViewResponse.create(order, entriesInThisOrder)

    val expected = OrderViewResponse(
        order,
        listOf(
            OrderViewResponse.Companion.GroupedOrderEntry(
                dish1,
                2 * dish1.price,
                2,
                listOf(
                    OrderViewResponse.Companion.EatingPersonEntry(user1, "", emptyList()),
                    OrderViewResponse.Companion.EatingPersonEntry(user1, "", emptyList())
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