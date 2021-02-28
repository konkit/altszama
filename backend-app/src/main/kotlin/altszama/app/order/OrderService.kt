package altszama.app.order

import java.time.LocalTime
import java.time.temporal.ChronoUnit
import altszama.app.notification.NotificationService
import altszama.app.auth.UserService
import altszama.app.order.dto.OrderSaveRequest
import altszama.app.order.dto.OrderUpdateRequest
import altszama.app.orderEntry.*
import altszama.app.restaurant.RestaurantRepository
import altszama.app.validation.ValidationFailedException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter


@Service
class OrderService {

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var orderRepository: OrderRepository

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  @Autowired
  private lateinit var notificationService: NotificationService

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository


  fun saveOrder(orderSaveRequest: OrderSaveRequest) {
    val restaurant = restaurantRepository.findById(orderSaveRequest.restaurantId!!).get()

    val order = Order(
        restaurant = restaurant,
        orderCreator = userService.currentUser(),
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

    orderRepository.save(order)
  }

  fun updateOrder(orderUpdateRequest: OrderUpdateRequest) {
    val oldOrder = orderRepository.findById(orderUpdateRequest.orderId!!).get()

    val updatedOrder = oldOrder.copy(
        orderDate = orderUpdateRequest.orderDate!!,
        timeOfOrder = orderUpdateRequest.timeOfOrder,
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

  fun setAsCreated(orderId: String) {
    val currentUser = userService.currentUser()

    val order = orderRepository.findById(orderId).orElseThrow({ throw ValidationFailedException("Order not found") })

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    order.orderState = OrderState.CREATED
    order.timeOfDelivery = null
    orderRepository.save(order)
  }

  fun setAsOrdering(orderId: String) {
    val currentUser = userService.currentUser()

    val order = orderRepository.findById(orderId).orElseThrow({ throw ValidationFailedException("Order not found") })

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
    val currentUser = userService.currentUser()

    val order = orderRepository.findById(orderId).orElseThrow({ throw ValidationFailedException("Order not found") })

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    val orderEntriesSize = orderEntryRepository.findByOrderId(orderId).count()
    if (orderEntriesSize == 0) {
      throw ValidationFailedException("There are no order entries")
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

  fun setBackAsOrdered(orderId: String)  {
    val currentUser = userService.currentUser()

    val order = orderRepository.findById(orderId).orElseThrow({ throw ValidationFailedException("Order not found") })

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    order.orderState = OrderState.ORDERED
    orderRepository.save(order)
    notificationService.notificateDelivered(order)
  }

  fun setAsDelivered(orderId: String) {
    val currentUser = userService.currentUser()

    val order = orderRepository.findById(orderId).orElseThrow({ throw ValidationFailedException("Order not found") })

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    order.orderState = OrderState.DELIVERED
    order.timeOfDelivery = currentLocalTime().truncatedTo(ChronoUnit.MINUTES)
    orderRepository.save(order)
    notificationService.notificateDelivered(order)
  }

  fun setAsRejected(orderId: String)  {
    val currentUser = userService.currentUser()

    val order = orderRepository.findById(orderId).orElseThrow({ throw ValidationFailedException("Order not found") })

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    order.orderState = OrderState.REJECTED
    orderRepository.save(order)
    notificationService.notificateRejected(order)
  }

  fun deleteOrder(orderId: String) {
    val currentUser = userService.currentUser()

    val order = orderRepository.findById(orderId).orElseThrow({ throw ValidationFailedException("Order not found") })

    if (order.orderCreator != currentUser) {
      throw ValidationFailedException("You can edit only your orders.")
    }

    orderEntryRepository.deleteByOrderId(orderId)
    orderRepository.deleteById(orderId)
  }

  fun closePastOrders() {
    val orderStateTreatedAsClosed = listOf(OrderState.ORDERED, OrderState.REJECTED)
    val today = LocalDate.now()

    val orders = orderRepository.findByOrderStateNotInAndOrderDateBefore(orderStateTreatedAsClosed, today)

    orders.forEach { order: Order ->
      order.orderState = OrderState.ORDERED
      orderRepository.save(order)
    }
  }

  private fun currentLocalTime(): LocalTime {
    return LocalTime.now(ZoneId.of("Europe/Warsaw"))
  }
}

