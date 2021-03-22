package altszama.app.balance

import altszama.app.auth.User
import altszama.app.order.Order
import altszama.app.order.OrderRepository
import altszama.app.order.OrderState
import altszama.app.orderEntry.OrderEntry
import altszama.app.orderEntry.OrderEntryPaymentStatus
import altszama.app.orderEntry.OrderEntryRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

data class OrderHistory(val entries: List<OrderHistoryEntry>)

sealed class OrderHistoryEntry {
  abstract val orderId: String
  abstract val orderDate: LocalDate
  abstract val orderCreator: String
  abstract val restaurantName: String
  abstract val kind: String
}

data class OrderHistoryCreatedEntry(
  override val orderId: String,
  override val orderDate: LocalDate,
  override val orderCreator: String,
  override val restaurantName: String,
  val markedPaymentsTotalAmount: Int,
  val confirmedPaymentsTotalAmount: Int,
  val markedPaymentsCount: Int,
  val totalAmount: Int,
  override val kind: String = "createdEntry"
) : OrderHistoryEntry()

data class OrderHistoryParticipatedEntry(
  override val orderId: String,
  override val orderDate: LocalDate,
  override val orderCreator: String,
  override val restaurantName: String,
  val orderEntryAmount: Int,
  val status: OrderEntryPaymentStatus,
  override val kind: String = "participatedEntry"
) : OrderHistoryEntry()

@Service
class BalanceService {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  fun getOrderHistory(currentUser: User): OrderHistory {
    val ordersYouParticipatedIn = orderEntryRepository.findByUser(currentUser)
    val orderHistoryParticipatedEntries = ordersYouParticipatedIn
      .filter { orderEntry ->
        val orderNotCreatedByMe = orderEntry.order.orderCreator.id != currentUser.id
        val orderAlreadyOrdered = listOf(OrderState.ORDERED, OrderState.DELIVERED)
          .contains(orderEntry.order.orderState)
        
        orderNotCreatedByMe && orderAlreadyOrdered
      }
      .map { orderEntry -> createParticipatedEntry(orderEntry) }

    val ordersYouCreated = orderRepository.findByOrderCreator(currentUser)
    val orderHistoryCreatedEntries = ordersYouCreated
      .map { order -> createOrderHistoryCreatedEntry(order) }

    val orderHistoryEntries = (orderHistoryCreatedEntries + orderHistoryParticipatedEntries)
      .sortedByDescending { it.orderDate }

    return OrderHistory(orderHistoryEntries)
  }

  private fun createParticipatedEntry(orderEntry: OrderEntry): OrderHistoryParticipatedEntry {
    val userCount = orderEntryRepository.findByOrderId(orderEntry.order.id).size

    return OrderHistoryParticipatedEntry(
      orderEntry.id,
      orderEntry.order.orderDate,
      orderEntry.order.orderCreator.username,
      orderEntry.order.restaurant.name,
      orderEntry.getFinalPrice(userCount),
      orderEntry.paymentStatus
    )
  }

  private fun createOrderHistoryCreatedEntry(order: Order): OrderHistoryCreatedEntry {
    val userCount = orderEntryRepository.findByOrderId(order.id).size

    val orderEntries = orderEntryRepository.findByOrderId(order.id)

    val confirmedPaymentsTotalAmount = orderEntries
      .filter { oe -> oe.paymentStatus == OrderEntryPaymentStatus.CONFIRMED }
      .sumBy { oe -> oe.getFinalPrice(userCount) }

    val markedPayments = orderEntries
      .filter { oe -> oe.paymentStatus == OrderEntryPaymentStatus.MARKED }
    val markedPaymentsTotalAmount = markedPayments.sumBy { oe -> oe.getFinalPrice(userCount) }

    val totalAmount = Order.getTotalPrice(order, orderEntries)

    return OrderHistoryCreatedEntry(
      orderId = order.id,
      orderDate = order.orderDate,
      orderCreator = order.orderCreator.username,
      restaurantName = order.restaurant.name,
      markedPaymentsTotalAmount = markedPaymentsTotalAmount,
      markedPaymentsCount = markedPayments.size,
      confirmedPaymentsTotalAmount = confirmedPaymentsTotalAmount,
      totalAmount = totalAmount
    )
  }
}
