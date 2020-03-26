package altszama.app.order


enum class OrderState {
  CREATED,
  ORDERING,
  ORDERED,
  DELIVERED,
  REJECTED;

  fun getByName(name: String): OrderState {
    return when (name) {
      "CREATED" -> CREATED
      "ORDERING" -> ORDERING
      "ORDERED" -> ORDERED
      "DELIVERED" -> DELIVERED
      "REJECTED" -> REJECTED
      else -> CREATED
    }
  }
}