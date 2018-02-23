package altszama.orderEntry

import altszama.dish.Dish
import altszama.dish.SideDish
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

    var dish: Dish,

    var additionalComments: String = "",

    var chosenSideDishes: List<SideDish> = emptyList(),

    var paymentStatus: OrderEntryPaymentStatus = OrderEntryPaymentStatus.UNPAID,

    var created: LocalDate = LocalDate.now()
) {

  fun priceWithSidedishes(): Int {
    return dish.price + chosenSideDishes.map(SideDish::price).sum()
  }

}
