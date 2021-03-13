package altszama.app.orderEntry.dto


data class OrderEntryUpdateRequest(
  var id: String?,
  var dishEntryId: String?,
  var orderId: String?,
  var dishId: String?,
  var additionalComments: String = "",
  var newDish: Boolean?,
  var newDishName: String?,
  var newDishPrice: Int?,
  var sideDishes: List<SideDishData> = emptyList()
)