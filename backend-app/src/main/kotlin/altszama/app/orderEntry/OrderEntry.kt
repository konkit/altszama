package altszama.app.orderEntry

import altszama.app.auth.User
import altszama.app.order.Order
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.DBRef
import java.time.LocalDate

data class OrderEntry(
    @Id
    var id: String = ObjectId().toHexString(),

    @DBRef
    var order: Order,

    @DBRef
    var user: User,

    var dishEntries: List<DishEntry> = emptyList(),

    var paymentStatus: OrderEntryPaymentStatus = OrderEntryPaymentStatus.UNPAID,

    var created: LocalDate = LocalDate.now()
) {
    fun getFinalPrice(usersCount: Int): Int {
        val basePrice = dishEntries.sumBy { dishEntry -> dishEntry.priceWithSidedishes() }

        val decreaseAmount = (basePrice * (order.decreaseInPercent / 100.0)).toInt()
        val deliveryCostPerOrder = (order.deliveryCostPerEverybody / usersCount)
        val deliveryCostPerEntry = order.deliveryCostPerDish * dishEntries.size

        return basePrice - decreaseAmount + deliveryCostPerOrder + deliveryCostPerEntry
    }
}
