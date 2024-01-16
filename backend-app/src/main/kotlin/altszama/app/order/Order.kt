package altszama.app.order

import altszama.app.auth.User
import altszama.app.orderEntry.DishEntry
import altszama.app.orderEntry.OrderEntry
import altszama.app.restaurant.Restaurant
import altszama.app.team.Team
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.IndexDirection
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

@Document()
data class Order(
  @Id
  var id: String = ObjectId().toHexString(),

  @DBRef
  @Indexed()
  var team: Team,

  @DBRef
  @Indexed()
  var restaurant: Restaurant,

  @DBRef
  @Indexed()
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
      return entries.sumOf { it.dishEntries.sumOf(DishEntry::priceWithSidedishes) }
    }

    fun getTotalPrice(entries: List<OrderEntry>): Int {
      return entries.sumOf { orderEntry -> orderEntry.getFinalPrice(entries.size) }
    }
  }
}
