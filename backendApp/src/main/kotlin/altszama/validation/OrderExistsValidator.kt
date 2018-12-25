package altszama.validation

import altszama.order.OrderRepository
import org.springframework.beans.factory.annotation.Autowired
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = arrayOf(OrderExistsValidator::class))
annotation class OrderExists(
    val message: String = "Order doesn't exist.",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf()
)

class OrderExistsValidator : ConstraintValidator<OrderExists, String?> {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  override fun initialize(constraintAnnotation: OrderExists) {}

  override fun isValid(orderId: String?, context: ConstraintValidatorContext): Boolean {
    return orderId != null && orderRepository.existsById(orderId)
  }
}