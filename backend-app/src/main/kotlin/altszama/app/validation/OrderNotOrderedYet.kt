package altszama.app.validation

import altszama.app.order.OrderRepository
import altszama.app.order.OrderState
import org.springframework.beans.factory.annotation.Autowired
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass


@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = arrayOf(OrderNotOrderedYetValidator::class))
annotation class OrderNotOrderedYet(
    val message: String = "Order is already ordered.",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf()
)

class OrderNotOrderedYetValidator : ConstraintValidator<OrderNotOrderedYet, String?> {

  @Autowired
  private lateinit var orderRepository: OrderRepository

  override fun initialize(constraintAnnotation: OrderNotOrderedYet) {}

  override fun isValid(orderId: String?, context: ConstraintValidatorContext): Boolean {
    return orderRepository.findById(orderId!!)
        .map { order -> order.orderState == OrderState.CREATED }
        .orElse(true)
  }
}