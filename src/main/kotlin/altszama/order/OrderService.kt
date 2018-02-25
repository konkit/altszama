package altszama.order

import java.time.LocalTime
import java.time.temporal.ChronoUnit
import altszama.notification.NotificationService
import altszama.auth.AuthService
import altszama.order.dto.OrderSaveRequest
import altszama.order.dto.OrderUpdateRequest
import altszama.orderEntry.*
import altszama.restaurant.RestaurantRepository
import altszama.validation.ValidationFailedException
import org.funktionale.tries.Try
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.ZoneId
import java.time.format.DateTimeFormatter


@Service
class OrderService {

  @Autowired
  private lateinit var authService: AuthService

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var notificationService: NotificationService

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository


  fun saveOrder(orderSaveRequest: OrderSaveRequest) {
    val restaurant = restaurantRepository.findById(orderSaveRequest.restaurantId!!)!!

    val order = Order(
        restaurant = restaurant,
        orderCreator = authService.currentUser(),
        orderDate = orderSaveRequest.orderDate!!,
        timeOfOrder = orderSaveRequest.timeOfOrder,
        timeOfDelivery = null,
        decreaseInPercent = orderSaveRequest.decreaseInPercent,
        deliveryCostPerEverybody = orderSaveRequest.deliveryCostPerEverybody,
        deliveryCostPerDish = orderSaveRequest.deliveryCostPerDish,
        paymentByCash = orderSaveRequest.paymentByCash,
        paymentByBankTransfer = orderSaveRequest.paymentByBankTransfer,
        orderState = OrderState.CREATED,
        bankTransferNumber = orderSaveRequest.bankTransferNumber
    )

    orderRepository.save(order)
  }

  fun updateOrder(orderUpdateRequest: OrderUpdateRequest) {
    val restaurant = restaurantRepository.findById(orderUpdateRequest.restaurantId!!)

    val oldOrder = orderRepository.findOne(orderUpdateRequest.orderId)

    val updatedOrder = oldOrder.copy(
        restaurant = restaurant!!,
        orderDate = orderUpdateRequest.orderDate!!,
        timeOfOrder = orderUpdateRequest.timeOfOrder,
        decreaseInPercent = orderUpdateRequest.decreaseInPercent,
        deliveryCostPerEverybody = orderUpdateRequest.deliveryCostPerEverybody,
        deliveryCostPerDish = orderUpdateRequest.deliveryCostPerDish,
        paymentByCash = orderUpdateRequest.paymentByCash,
        paymentByBankTransfer = orderUpdateRequest.paymentByBankTransfer,
        bankTransferNumber = orderUpdateRequest.bankTransferNumber
    )

    orderRepository.save(updatedOrder)
  }

  fun setAsCreated(orderId: String) {
    val currentUser = authService.currentUser()

    val order = orderRepository.findOne(orderId) ?: throw ValidationFailedException("Order not found")

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    order.orderState = OrderState.CREATED
    order.timeOfDelivery = null
    orderRepository.save(order)
  }

  fun setAsOrdering(orderId: String) {
    val currentUser = authService.currentUser()

    val order = orderRepository.findOne(orderId) ?: throw ValidationFailedException("Order not found")

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    val orderEntriesSize = orderEntryRepository.findByOrderId(orderId).count()
    if (orderEntriesSize == 0) {
      throw ValidationFailedException("There are no order entries")
    }

    order.orderState = OrderState.ORDERING
    orderRepository.save(order)
  }

  fun setAsOrdered(orderId: String, approxTimeOfDelivery: String?)  {
    val currentUser = authService.currentUser()

    val order = orderRepository.findOne(orderId) ?: throw ValidationFailedException("Order not found")

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    val orderEntriesSize = orderEntryRepository.findByOrderId(orderId).count()
    if (orderEntriesSize == 0) {
      throw ValidationFailedException("There are no order entries")
    }

    order.orderState = OrderState.ORDERED
    order.timeOfOrder = currentLocalTime().truncatedTo(ChronoUnit.MINUTES)

    order.timeOfDelivery = Try { LocalTime.parse(approxTimeOfDelivery) }.getOrElse { null }

    val formatter = DateTimeFormatter.ISO_LOCAL_TIME
    val eta = order.timeOfDelivery?.format(formatter) ?: "Undefined"

    orderRepository.save(order)
    notificationService.notificateOrdered(order, eta)
  }

  fun setBackAsOrdered(orderId: String)  {
    val currentUser = authService.currentUser()

    val order = orderRepository.findOne(orderId) ?: throw ValidationFailedException("Order not found")

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    order.orderState = OrderState.ORDERED
    orderRepository.save(order)
    notificationService.notificateDelivered(order)
  }

  fun setAsDelivered(orderId: String) {
    val currentUser = authService.currentUser()

    val order = orderRepository.findOne(orderId) ?: throw ValidationFailedException("Order not found")

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    order.orderState = OrderState.DELIVERED
    order.timeOfDelivery = currentLocalTime().truncatedTo(ChronoUnit.MINUTES)
    orderRepository.save(order)
    notificationService.notificateDelivered(order)
  }

  fun setAsRejected(orderId: String)  {
    val currentUser = authService.currentUser()

    val order = orderRepository.findOne(orderId) ?: throw ValidationFailedException("Order not found")

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    order.orderState = OrderState.REJECTED
    orderRepository.save(order)
    notificationService.notificateRejected(order)
  }

  fun deleteOrder(orderId: String) {
    val currentUser = authService.currentUser()

    val order = orderRepository.findOne(orderId) ?: throw ValidationFailedException("Order not found")

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    orderEntryRepository.deleteByOrderId(orderId)
    orderRepository.delete(orderId)
  }

  private fun currentLocalTime(): LocalTime {
    return LocalTime.now(ZoneId.of("Europe/Warsaw"))
  }
}

