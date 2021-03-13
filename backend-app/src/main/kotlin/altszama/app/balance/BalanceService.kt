package altszama.app.balance

import altszama.app.auth.User
import altszama.app.order.Order
import altszama.app.order.OrderRepository
import altszama.app.orderEntry.OrderEntryPaymentStatus
import altszama.app.orderEntry.OrderEntryRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

data class OrderHistory(
  val createdEntries: List<OrderHistoryCreatedEntry>,
  val participatedEntries: List<OrderHistoryParticipatedEntry>
)

data class OrderHistoryCreatedEntry(
  val orderId: String,
  val orderDate: LocalDate,
  val restaurantName: String,
  val markedPayments: Int,
  val confirmedPayments: Int,
  val entriesToConfirm: Int,
  val totalOrderPrice: Int
)

data class OrderHistoryParticipatedEntry(
  val orderId: String,
  val orderDate: LocalDate,
  val restaurantName: String,
  val orderEntryAmount: Int,
  val status: OrderEntryPaymentStatus
)

@Service
class BalanceService {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  fun getOrderHistory(currentUser: User): OrderHistory {
    val ordersYouParticipatedIn = orderEntryRepository.findByUser(currentUser)
    val orderHistoryParticipatedEntries = ordersYouParticipatedIn
      .map { orderEntry ->
        val userCount = orderEntryRepository.findByOrderId(orderEntry.order.id).size

        OrderHistoryParticipatedEntry(
          orderEntry.id,
          orderEntry.order.orderDate,
          orderEntry.order.restaurant.name,
          orderEntry.getFinalPrice(userCount),
          orderEntry.paymentStatus
        )
      }

    val ordersYouCreated = orderRepository.findByOrderCreator(currentUser)
    val orderHistoryCreatedEntries = ordersYouCreated
      .map { order -> createOrderHistoryCreatedEntry(order) }

    return OrderHistory(orderHistoryCreatedEntries, orderHistoryParticipatedEntries)
  }

  private fun createOrderHistoryCreatedEntry(order: Order): OrderHistoryCreatedEntry {
    val userCount = orderEntryRepository.findByOrderId(order.id).size

    val orderEntries = orderEntryRepository.findByOrderId(order.id)

    val confirmedPayments = orderEntries
      .filter { oe -> oe.paymentStatus == OrderEntryPaymentStatus.CONFIRMED }
      .sumBy { oe -> oe.getFinalPrice(userCount) }

    val markedPayments = orderEntries
      .filter { oe -> oe.paymentStatus == OrderEntryPaymentStatus.MARKED }
    val markedPaymentsTotalSum = markedPayments.sumBy { oe -> oe.getFinalPrice(userCount) }

    val totalOrderPrice = Order.getTotalPrice(order, orderEntries)

    return OrderHistoryCreatedEntry(
      order.id,
      order.orderDate,
      order.restaurant.name,
      markedPaymentsTotalSum,
      confirmedPayments,
      markedPayments.size,
      totalOrderPrice
    )
  }
}
