package altszama.app.order.dto

import altszama.app.order.Order
import altszama.app.order.OrderState
import com.fasterxml.jackson.annotation.JsonFormat
import io.swagger.v3.oas.annotations.media.Schema
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import java.time.LocalTime

data class EditOrderResponse(val order: EditResponseOrderDto) {

  companion object {

    data class EditResponseOrderDto(
        val id: String,
        val restaurantId: String,
        val restaurantName: String,
        val orderCreatorId: String,
        val orderCreatorUsername: String,

        @Schema(
                type="string",
                pattern = "[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]",
                example = "2017-01-31"
        )
        @JsonFormat(pattern = "yyyy-MM-dd")
        @DateTimeFormat(pattern = "yyyy-MM-dd")
        val orderDate: LocalDate,

        @Schema(
                type="string",
                pattern = "[0-9][0-9]:[0-9][0-9]",
                example = "12:00"
        )
        @JsonFormat(pattern = "HH:mm")
        @DateTimeFormat(pattern = "HH:mm")
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

    fun create(order: Order): EditOrderResponse {
      val ordedDto = EditResponseOrderDto(
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

      return EditOrderResponse(ordedDto)
    }
  }
}