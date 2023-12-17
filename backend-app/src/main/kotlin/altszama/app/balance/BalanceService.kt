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

    val owedMoneyMap = createOwedMoneyMap(ordersUserCreated, orderEntriesUserParticipatedIn)

    return OrderHistory(owedMoneyMap)
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
      .mapValues { entry -> entry.value.sumBy { pair -> pair.second } }
      .entries

    val tuples2 = orderEntriesUserParticipatedIn
      .filter { orderEntry -> orderEntry.paymentStatus == OrderEntryPaymentStatus.UNPAID }
      .map { orderEntry ->
        Pair(
          orderEntry.order.orderCreator,
          -orderEntry.getFinalPrice(orderEntryRepository.findByOrderId(orderEntry.order.id).size)
        )
      }
      .toMap()
      .entries

    return (tuples + tuples2)
      .groupBy { it.key }
      .map { entry -> Pair(entry.key.username, entry.value.sumBy { it.value }) }
      .toMap()
  }

  private fun orderAlreadyOrdered(order: Order): Boolean =
    listOf(OrderState.ORDERED, OrderState.DELIVERED).contains(order.orderState)

  private fun orderNotCreatedByMe(orderEntry: OrderEntry, currentUser: User): Boolean =
    orderEntry.order.orderCreator.id != currentUser.id
}
