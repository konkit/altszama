package altszama.app.validation

import altszama.app.orderEntry.OrderEntryRepository
import org.springframework.beans.factory.annotation.Autowired
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = arrayOf(OrderEntryExistsValidator::class))
annotation class OrderEntryExists(
    val message: String = "Order entry doesn't exist.",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf()
)

class OrderEntryExistsValidator : ConstraintValidator<OrderEntryExists, String?> {

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository

  override fun initialize(constraintAnnotation: OrderEntryExists) {}

  override fun isValid(orderEntryId: String?, context: ConstraintValidatorContext): Boolean {
    return orderEntryId != null && orderEntryRepository.existsById(orderEntryId)
  }
}