package altszama.order

import altszama.restaurant.Restaurant
import altszama.auth.User
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

    var bankTransferNumber: String = ""
)
