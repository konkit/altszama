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


@Service
class BalanceService {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  fun getOrderHistory(currentUser: User): OrderHistory {
    val ordersYouParticipatedIn = orderEntryRepository.findByUser(currentUser)
    val orderHistoryParticipatedEntries = ordersYouParticipatedIn
      .filter { orderEntry -> orderNotCreatedByMe(orderEntry, currentUser) && orderAlreadyOrdered(orderEntry.order) }
      .map { orderEntry -> createParticipatedEntry(orderEntry) }

    val ordersYouCreated = orderRepository.findByOrderCreator(currentUser)
    val orderHistoryCreatedEntries = ordersYouCreated
      .filter { order -> orderAlreadyOrdered(order) }
      .map { order -> createOrderHistoryCreatedEntry(order) }

    val orderHistoryEntries = (orderHistoryCreatedEntries + orderHistoryParticipatedEntries)
      .sortedByDescending { it.orderDate }

    return OrderHistory(orderHistoryEntries)
  }

  private fun orderAlreadyOrdered(order: Order): Boolean =
    listOf(OrderState.ORDERED, OrderState.DELIVERED).contains(order.orderState)

  private fun orderNotCreatedByMe(orderEntry: OrderEntry, currentUser: User): Boolean =
    orderEntry.order.orderCreator.id != currentUser.id

  private fun createParticipatedEntry(orderEntry: OrderEntry): OrderHistoryParticipatedEntry {
    val userCount = orderEntryRepository.findByOrderId(orderEntry.order.id).size

    return OrderHistoryParticipatedEntry(
      orderEntry.order.id,
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
