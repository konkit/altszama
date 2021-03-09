package altszama.app.order.dto

data class DeliveryData(val decreaseInPercent: Int = 0,
                           val deliveryCostPerEverybody: Int = 0,
                           val deliveryCostPerDish: Int = 0)

data class PaymentData(val paymentByCash: Boolean = false,
                       val paymentByBankTransfer: Boolean = false,
                       val bankTransferNumber: String = "",
                       val paymentByBlik: Boolean = false,
                       val blikPhoneNumber: String = "")
