package altszama.app.order.dto

import altszama.app.order.Order
import altszama.app.order.OrderState
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

data class EditResponse(val order: OrderDto) {

  companion object {

    data class OrderDto(
        val id: String,
        val restaurantId: String,
        val restaurantName: String,
        val orderCreatorId: String,
        val orderCreatorUsername: String,
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        val orderDate: LocalDate,
        val timeOfOrder: LocalTime?,
        var timeOfDelivery: LocalTime?,
        var orderState: OrderState,
        var decreaseInPercent: Int,
        var deliveryCostPerEverybody: Int,
        var deliveryCostPerDish: Int,
        var paymentByCash: Boolean,
        var paymentByBankTransfer: Boolean,
        var bankTransferNumber: String,
        val paymentByBlik: Boolean,
        val blikPhoneNumber: String
    )

    fun create(order: Order): EditResponse {
      val ordedDto = OrderDto(
          order.id,
          order.restaurant.id,
          order.restaurant.name,
          order.orderCreator.id,
          order.orderCreator.username,
          order.orderDate,
          order.timeOfOrder,
          order.timeOfDelivery,
          order.orderState,
          order.decreaseInPercent,
          order.deliveryCostPerEverybody,
          order.deliveryCostPerDish,
          order.paymentByCash,
          order.paymentByBankTransfer,
          order.bankTransferNumber,
          order.paymentByBlik,
          order.blikPhoneNumber
      )

      return EditResponse(ordedDto)
    }
  }
}