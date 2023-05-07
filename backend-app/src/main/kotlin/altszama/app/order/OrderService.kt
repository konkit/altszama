package altszama.app.order

import altszama.app.auth.User
import altszama.app.notification.NotificationService
import altszama.app.observability.MetricCountersService
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.OrderUpdateRequest
import altszama.app.orderEntry.OrderEntryRepository
import altszama.app.restaurant.RestaurantRepository
import altszama.app.team.Team
import altszama.app.validation.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.*


@Service
class OrderService {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var notificationService: NotificationService

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository

  @Autowired
  private lateinit var metricCountersService: MetricCountersService

  fun saveOrder(orderSaveRequest: OrderSaveRequest, currentUser: User, currentUserTeam: Team): Order {
    val restaurant = Optional.ofNullable(orderSaveRequest.restaurantId)
        .flatMap { restaurantId -> restaurantRepository.findById(restaurantId) }
        .orElseThrow { RestaurantDoesNotExist() }

    if (restaurant.team != currentUserTeam) {
      throw NoAccessToRestaurant()
    }

    if (orderSaveRequest.orderDate == null) {
      throw OrderDateIsInvalid()
    }

    if (orderSaveRequest.paymentData.paymentByBankTransfer && orderSaveRequest.paymentData.bankTransferNumber.isBlank()) {
      throw BankTransferNumberNotSpecified()
    }

    val order = Order(
        restaurant = restaurant,
        team = restaurant.team,
        orderCreator = currentUser,
        orderDate = orderSaveRequest.orderDate!!,
        timeOfOrder = orderSaveRequest.timeOfOrder,
        timeOfDelivery = null,
        decreaseInPercent = orderSaveRequest.deliveryData.decreaseInPercent,
        deliveryCostPerEverybody = orderSaveRequest.deliveryData.deliveryCostPerEverybody,
        deliveryCostPerDish = orderSaveRequest.deliveryData.deliveryCostPerDish,
        paymentByCash = orderSaveRequest.paymentData.paymentByCash,
        paymentByBankTransfer = orderSaveRequest.paymentData.paymentByBankTransfer,
        paymentByBlik = orderSaveRequest.paymentData.paymentByBlik,
        orderState = OrderState.CREATED,
        bankTransferNumber = orderSaveRequest.paymentData.bankTransferNumber,
        blikPhoneNumber = orderSaveRequest.paymentData.blikPhoneNumber
    )

    val result = orderRepository.save(order)
    metricCountersService.createdOrdersCounter.increment()
    return result
  }

  fun updateOrder(orderUpdateRequest: OrderUpdateRequest, currentUser: User, currentUserTeam: Team) {
    val order = Optional.ofNullable(orderUpdateRequest.orderId)
        .flatMap { orderId -> orderRepository.findById(orderId) }
        .orElseThrow { OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCanEditOnlyYourOwnOrders()
    }

    if (orderUpdateRequest.orderDate == null) {
      throw OrderDateIsInvalid()
    }

    if (orderUpdateRequest.paymentData.paymentByBankTransfer && orderUpdateRequest.paymentData.bankTransferNumber.isBlank()) {
      throw BankTransferNumberNotSpecified()
    }

    val oldOrder = orderRepository.findById(orderUpdateRequest.orderId!!).get()

    val updatedOrder = oldOrder.copy(
        orderDate = orderUpdateRequest.orderDate!!,
        timeOfOrder = orderUpdateRequest.timeOfOrder,
        timeOfDelivery = orderUpdateRequest.timeOfDelivery,
        decreaseInPercent = orderUpdateRequest.deliveryData.decreaseInPercent,
        deliveryCostPerEverybody = orderUpdateRequest.deliveryData.deliveryCostPerEverybody,
        deliveryCostPerDish = orderUpdateRequest.deliveryData.deliveryCostPerDish,
        paymentByCash = orderUpdateRequest.paymentData.paymentByCash,
        paymentByBankTransfer = orderUpdateRequest.paymentData.paymentByBankTransfer,
        paymentByBlik = orderUpdateRequest.paymentData.paymentByBlik,
        bankTransferNumber = orderUpdateRequest.paymentData.bankTransferNumber,
        blikPhoneNumber = orderUpdateRequest.paymentData.blikPhoneNumber
    )

    orderRepository.save(updatedOrder)
  }

  fun setAsCreated(orderId: String, currentUser: User) {
    val order = orderRepository.findById(orderId).orElseThrow { throw OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCanEditOnlyYourOwnOrders()
    }

    order.orderState = OrderState.CREATED
    order.timeOfDelivery = null
    orderRepository.save(order)
  }

  fun setAsOrdering(orderId: String, currentUser: User) {
    val order = orderRepository.findById(orderId).orElseThrow { throw OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCanEditOnlyYourOwnOrders()
    }

    val orderEntriesSize = orderEntryRepository.findByOrderId(orderId).count()
    if (orderEntriesSize == 0) {
      throw NoOrderEntriesInThisOrder()
    }

    order.orderState = OrderState.ORDERING
    orderRepository.save(order)
  }

  fun setAsOrdered(orderId: String, approxTimeOfDelivery: String?, currentUser: User)  {
    val order = orderRepository.findById(orderId).orElseThrow { throw OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCanEditOnlyYourOwnOrders()
    }

    val orderEntriesSize = orderEntryRepository.findByOrderId(orderId).count()
    if (orderEntriesSize == 0) {
      throw NoOrderEntriesInThisOrder()
    }

    order.orderState = OrderState.ORDERED
    order.timeOfOrder = currentLocalTime().truncatedTo(ChronoUnit.MINUTES)

    try {
      order.timeOfDelivery = LocalTime.parse(approxTimeOfDelivery)
    } catch (e: Exception) {
      order.timeOfDelivery = null
    }

    val formatter = DateTimeFormatter.ISO_LOCAL_TIME
    val eta = order.timeOfDelivery?.format(formatter) ?: "Undefined"

    orderRepository.save(order)
    notificationService.notificateOrdered(order, eta)
  }

  fun setBackAsOrdered(orderId: String, currentUser: User)  {
    val order = orderRepository.findById(orderId).orElseThrow { throw OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCanEditOnlyYourOwnOrders()
    }

    order.orderState = OrderState.ORDERED
    orderRepository.save(order)
    notificationService.notificateDelivered(order)
  }

  fun setAsDelivered(orderId: String, currentUser: User) {
    val order = orderRepository.findById(orderId).orElseThrow { throw OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCanEditOnlyYourOwnOrders()
    }

    val orderEntriesSize = orderEntryRepository.findByOrderId(orderId).count()
    if (orderEntriesSize == 0) {
      throw NoOrderEntriesInThisOrder()
    }

    order.orderState = OrderState.DELIVERED
    order.timeOfDelivery = currentLocalTime().truncatedTo(ChronoUnit.MINUTES)
    orderRepository.save(order)
    notificationService.notificateDelivered(order)
  }

  fun setAsRejected(orderId: String, currentUser: User)  {
    val order = orderRepository.findById(orderId).orElseThrow { throw OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCanEditOnlyYourOwnOrders()
    }

    order.orderState = OrderState.REJECTED
    orderRepository.save(order)
    notificationService.notificateRejected(order)
  }

  fun deleteOrder(orderId: String, currentUser: User) {
    val order = orderRepository.findById(orderId).orElseThrow { throw OrderDoesNotExist() }

    if (order.orderCreator != currentUser) {
      throw YouCanEditOnlyYourOwnOrders()
    }

    orderEntryRepository.deleteByOrderId(orderId)
    orderRepository.deleteById(orderId)
  }

  fun closePastOrders() {
    val terminalOrderStates = listOf(OrderState.DELIVERED, OrderState.REJECTED)
    val today = LocalDate.now()

    val orders = orderRepository.findByOrderStateNotInAndOrderDateBefore(terminalOrderStates, today)

    orders.forEach { order: Order ->
      if (listOf(OrderState.CREATED, OrderState.ORDERING).contains(order.orderState)) {
        order.orderState = OrderState.REJECTED
      } else {
        order.orderState = OrderState.DELIVERED
      }
      orderRepository.save(order)
    }
  }

  private fun currentLocalTime(): LocalTime {
    return LocalTime.now(ZoneId.of("Europe/Warsaw"))
  }
}

