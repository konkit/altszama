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
    val owedMoneyByUser = createOwedMoneyEntries(currentUser, ordersUserCreated, orderEntriesUserParticipatedIn)
    val owedMoneyMap = owedMoneyByUser
      .groupBy { entry -> entry.username }
      .mapValues { (_, entries) -> entries.sumOf { entry -> entry.amount } }
      .filterValues { amount -> amount != 0 }

    return OrderHistory(orderHistoryEntries, owedMoneyMap, owedMoneyByUser)
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

  private fun createOwedMoneyEntries(
    currentUser: User,
    ordersUserCreated: List<Order>,
    orderEntriesUserParticipatedIn: List<OrderEntry>
  ): List<OwedMoneyEntry> {
    val owedToCurrentUser = ordersUserCreated
      .flatMap { order ->
        val userCount = orderEntryRepository.countByOrder(order)
        val orderEntries = orderEntryRepository.findByOrderAndPaymentStatus(order, OrderEntryPaymentStatus.UNPAID)

        orderEntries
          // Nobody owes money to themselves, even if the owner's own entry was marked as unpaid
          .filter { orderEntry -> orderEntry.user.id != currentUser.id }
          .map { orderEntry -> Pair(orderEntry.user, orderEntry.getFinalPrice(userCount)) }
      }

    val owedByCurrentUser = orderEntriesUserParticipatedIn
      .filter { orderEntry -> orderEntry.paymentStatus == OrderEntryPaymentStatus.UNPAID }
      .map { orderEntry ->
        Pair(
          orderEntry.order.orderCreator,
          -orderEntry.getFinalPrice(orderEntryRepository.findByOrderId(orderEntry.order.id).size)
        )
      }

    // Grouped by user id, so people with the same name are kept apart
    return (owedToCurrentUser + owedByCurrentUser)
      .groupBy { (user, _) -> user.id }
      .map { (_, pairs) ->
        val user = pairs.first().first
        OwedMoneyEntry(user.id, user.username, pairs.sumOf { (_, amount) -> amount })
      }
      .filter { entry -> entry.amount != 0 }
      .sortedByDescending { entry -> entry.amount }
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
