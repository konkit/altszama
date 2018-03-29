package altszama.orderEntry

import altszama.order.Order
import altszama.auth.User
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
)
