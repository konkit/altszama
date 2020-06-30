package altszama.app.order.dto

import altszama.app.validation.BankTransferNumberPresent

data class DeliveryData(val decreaseInPercent: Int = 0,
                           val deliveryCostPerEverybody: Int = 0,
                           val deliveryCostPerDish: Int = 0)

@BankTransferNumberPresent(
        paymentByBankTransfer = "paymentByBankTransfer",
        bankTransferNumber = "bankTransferNumber")
data class PaymentData(val paymentByCash: Boolean = false,
                       val paymentByBankTransfer: Boolean = false,
                       val bankTransferNumber: String = "",
                       val paymentByBlik: Boolean = false,
                       val blikPhoneNumber: String = "")