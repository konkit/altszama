package altszama.app.order

import altszama.app.auth.User
import altszama.app.orderEntry.DishEntry
import altszama.app.orderEntry.OrderEntry
import altszama.app.restaurant.Restaurant
import altszama.app.team.Team
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.index.CompoundIndexes
import org.springframework.data.mongodb.core.index.IndexDirection
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

@Document()
@CompoundIndexes(value = [
  CompoundIndex(name = "restaurant_id_to_restaurant", def = "{'restaurant.\$id' : 1}"),
  CompoundIndex(name = "team_id_to_team", def = "{'team.\$id' : 1}"),
  CompoundIndex(name = "user_id_to_user", def = "{'user.\$id' : 1}")
])
data class Order(
  @Id
  var id: String = ObjectId().toHexString(),

  @DBRef
  var team: Team,

  @DBRef
  var restaurant: Restaurant,

  @DBRef
  var orderCreator: User,

  @DateTimeFormat(pattern = "yyyy-MM-dd")
  @Indexed(direction = IndexDirection.DESCENDING)
  var orderDate: LocalDate,

  var timeOfOrder: LocalTime? = null,

  var timeOfDelivery: LocalTime? = null,

  @Indexed()
  var orderState: OrderState = OrderState.CREATED,

  var decreaseInPercent: Int = 0,

  var deliveryCostPerEverybody: Int = 0,

  var deliveryCostPerDish: Int = 0,

  var paymentByCash: Boolean = true,

  var paymentByBankTransfer: Boolean = true,

  var bankTransferNumber: String = "",

  var paymentByBlik: Boolean = false,

  var blikPhoneNumber: String = ""
) {
  companion object {
    fun getBasePrice(entries: List<OrderEntry>): Int {
      return entries
        .map { it.dishEntries.sumBy(DishEntry::priceWithSidedishes) }
        .sum()
    }

    fun getTotalPrice(order: Order, entries: List<OrderEntry>): Int {
      val basePriceSum = getBasePrice(entries)

      val decrease = (basePriceSum * order.decreaseInPercent / 100.0).toInt()
      val deliveryCostPerDishes = entries.flatMap { it.dishEntries }.size * order.deliveryCostPerDish
      val priceModifiers = -decrease + order.deliveryCostPerEverybody + deliveryCostPerDishes

      return basePriceSum + priceModifiers
    }
  }
}
