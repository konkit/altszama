package altszama.app.balance

import altszama.app.orderEntry.OrderEntryPaymentStatus
import java.time.LocalDate

data class OrderHistory(val entries: List<OrderHistoryEntry>, val owedMoney: Map<String, Int>)

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
  val confirmedPaymentsTotalAmount: Int,
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