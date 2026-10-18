package altszama.app.balance

import altszama.app.orderEntry.OrderEntryPaymentStatus
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDate


data class OrderHistory(
  val entries: List<OrderHistoryEntry>,
  // Kept for older clients. Keyed by username, so people with the same name are summed together.
  val owedMoney: Map<String, Int>,
  // Positive amount: the user owes you; negative: you owe them
  val owedMoneyByUser: List<OwedMoneyEntry> = emptyList()
)

data class OwedMoneyEntry(val userId: String, val username: String, val amount: Int)

@Schema(
  oneOf = arrayOf(
    OrderHistoryCreatedEntry::class,
    OrderHistoryParticipatedEntry::class
  ),
)
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
