package altszama.app.orderEntry

import altszama.app.auth.User
import altszama.app.order.Order
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.index.CompoundIndexes
import org.springframework.data.mongodb.core.mapping.DBRef
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDate

@Document
@CompoundIndexes(value = [
    CompoundIndex(name = "order_id_to_order", def = "{'order.\$id' : 1}"),
    CompoundIndex(name = "user_id_to_user", def = "{'user.\$id' : 1}"),
    CompoundIndex(name = "dishEntries_dish_id_to_dishEntries_dish", def = "{'dishEntries.dish._id' : 1}")
])
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
