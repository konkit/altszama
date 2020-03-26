package altszama.app.validation

import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass


@Target(AnnotationTarget.CLASS)
@Constraint(validatedBy = arrayOf(BankTransferNumberPresentValidator::class))
annotation class BankTransferNumberPresent(
    val message: String = "Bank transfer number is missing",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf(),
    val paymentByBankTransfer: String,
    val bankTransferNumber: String
)

class BankTransferNumberPresentValidator : ConstraintValidator<BankTransferNumberPresent, Any> {

  private lateinit var paymentByBankTransferFieldName: String
  private lateinit var bankTransferNumberFieldName: String

  override fun initialize(constraintAnnotation: BankTransferNumberPresent) {
    this.paymentByBankTransferFieldName = constraintAnnotation.paymentByBankTransfer
    this.bankTransferNumberFieldName = constraintAnnotation.bankTransferNumber
  }

  override fun isValid(cmdObj: Any, context: ConstraintValidatorContext): Boolean {
    val clazz: Class<Any> = cmdObj.javaClass

    val paymentByBankTransfer = getFieldValue(paymentByBankTransferFieldName, cmdObj, clazz) as Boolean
    val bankTransferNumber = getFieldValue(bankTransferNumberFieldName, cmdObj, clazz) as String

    return paymentByBankTransfer == false || bankTransferNumber.isNotBlank()
  }

  private fun getFieldValue(fieldName: String, obj: Any, clazz: Class<Any>): Any? {
    val field = clazz.getDeclaredField(fieldName)
    field.isAccessible = true
    return field.get(obj)
  }
}