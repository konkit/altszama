package altszama.validation

import altszama.auth.AuthService
import altszama.order.OrderRepository
import org.springframework.beans.factory.annotation.Autowired
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass


@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = arrayOf(IsOrderOwnerValidator::class))
annotation class IsOrderOwner(
    val message: String = "You can edit only your own orders.",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf()
)

class IsOrderOwnerValidator : ConstraintValidator<IsOrderOwner, String?> {

  @Autowired
  private lateinit var authService: AuthService

  @Autowired
  private lateinit var orderRepository: OrderRepository


  override fun initialize(constraintAnnotation: IsOrderOwner) {}

  override fun isValid(orderId: String?, context: ConstraintValidatorContext): Boolean {
    val order = orderRepository.findById(orderId!!).get()
    val currentUser = authService.currentUser()

    return order.orderCreator == currentUser
  }
}