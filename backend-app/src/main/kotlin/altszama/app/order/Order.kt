package altszama.app.order

import altszama.app.restaurant.Restaurant
import altszama.app.auth.User
import altszama.app.orderEntry.DishEntry
import altszama.app.orderEntry.OrderEntry
import altszama.app.team.Team
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime


data class Order(
        @Id
        var id: String = ObjectId().toHexString(),

        @DBRef
        var restaurant: Restaurant,

        @DBRef
        var orderCreator: User,

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        var orderDate: LocalDate,

        var timeOfOrder: LocalTime? = null,

        var timeOfDelivery: LocalTime? = null,

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
