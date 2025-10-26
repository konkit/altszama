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
    val ordersUserCreated = orderRepository.findByOrderCreator(currentUser)
      .filter { order -> orderAlreadyOrdered(order) }

    val orderEntriesUserParticipatedIn = orderEntryRepository.findByUser(currentUser)
      .filter { orderEntry -> orderNotCreatedByMe(orderEntry, currentUser) && orderAlreadyOrdered(orderEntry.order) }

    val orderHistoryEntries = createOrderHistoryEntries(ordersUserCreated, orderEntriesUserParticipatedIn)
    val owedMoneyMap = createOwedMoneyMap(ordersUserCreated, orderEntriesUserParticipatedIn)

    return OrderHistory(orderHistoryEntries, owedMoneyMap)
  }

  private fun createOrderHistoryEntries(
    ordersUserCreated: List<Order>,
    orderEntriesUserParticipatedIn: List<OrderEntry>
  ): List<OrderHistoryEntry> {
    val orderHistoryCreatedEntries = ordersUserCreated
      .map { order ->
        val orderEntries = orderEntryRepository.findByOrder(order)
        createOrderHistoryCreatedEntry(order, orderEntries)
      }

    val orderHistoryParticipatedEntries = orderEntriesUserParticipatedIn
      .map { orderEntry ->
        val countOfEntriesInOrder = orderEntryRepository.countByOrder(orderEntry.order)
        createParticipatedEntry(orderEntry, countOfEntriesInOrder)
      }

    return (orderHistoryCreatedEntries + orderHistoryParticipatedEntries)
      .sortedByDescending { it.orderDate }
  }

  private fun createOwedMoneyMap(
    ordersUserCreated: List<Order>,
    orderEntriesUserParticipatedIn: List<OrderEntry>
  ): Map<String, Int> {
    val tuples = ordersUserCreated
      .flatMap { order ->
        val userCount = orderEntryRepository.countByOrder(order)
        val orderEntries = orderEntryRepository.findByOrderAndPaymentStatus(order, OrderEntryPaymentStatus.UNPAID)

        orderEntries
          .map { orderEntry -> Pair(orderEntry.user, orderEntry.getFinalPrice(userCount)) }
      }
      .groupBy { pair -> pair.first }
      .mapValues { entry -> entry.value.sumOf { pair -> pair.second } }
      .entries

    val tuples2 = orderEntriesUserParticipatedIn
      .filter { orderEntry -> orderEntry.paymentStatus == OrderEntryPaymentStatus.UNPAID }
      .map { orderEntry ->
        Pair(
          orderEntry.order.orderCreator,
          -orderEntry.getFinalPrice(orderEntryRepository.findByOrderId(orderEntry.order.id).size)
        )
      }
      .groupBy { pair -> pair.first }
      .mapValues { entry -> entry.value.sumOf { pair -> pair.second } }
      .entries

    return (tuples + tuples2)
      .groupBy { it.key }
      .map { entry -> Pair(entry.key.username, entry.value.sumOf { it.value }) }
      .filter { it.second != 0 }
      .toMap()
  }

  private fun orderAlreadyOrdered(order: Order): Boolean =
    listOf(OrderState.ORDERED, OrderState.DELIVERED).contains(order.orderState)

  private fun orderNotCreatedByMe(orderEntry: OrderEntry, currentUser: User): Boolean =
    orderEntry.order.orderCreator.id != currentUser.id

  private fun createParticipatedEntry(orderEntry: OrderEntry, countOfEntriesInOrder: Int): OrderHistoryParticipatedEntry {
    return OrderHistoryParticipatedEntry(
      orderEntry.order.id,
      orderEntry.order.orderDate,
      orderEntry.order.orderCreator.username,
      orderEntry.order.restaurant.name,
      orderEntry.getFinalPrice(countOfEntriesInOrder),
      orderEntry.paymentStatus
    )
  }

  private fun createOrderHistoryCreatedEntry(order: Order, orderEntries: List<OrderEntry>): OrderHistoryCreatedEntry {
    val confirmedPaymentsTotalAmount = orderEntries
      .filter { orderEntry -> orderEntry.paymentStatus == OrderEntryPaymentStatus.CONFIRMED }
      .sumOf { orderEntry -> orderEntry.getFinalPrice(orderEntries.size) }

    val totalAmount = Order.getTotalPrice(orderEntries)

    return OrderHistoryCreatedEntry(
      orderId = order.id,
      orderDate = order.orderDate,
      orderCreator = order.orderCreator.username,
      restaurantName = order.restaurant.name,
      confirmedPaymentsTotalAmount = confirmedPaymentsTotalAmount,
      totalAmount = totalAmount
    )
  }
}
