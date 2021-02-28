package altszama.app.validation

import altszama.app.auth.UserService
import altszama.app.orderEntry.OrderEntryRepository
import org.springframework.beans.factory.annotation.Autowired
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass


@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = arrayOf(IsOrderEntryOwnerValidator::class))
annotation class IsOrderEntryOwner(
    val message: String = "You can edit only your own order entries.",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf()
)

class IsOrderEntryOwnerValidator : ConstraintValidator<IsOrderEntryOwner, String?> {

  @Autowired
  private lateinit var userService: UserService

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository


  override fun initialize(constraintAnnotation: IsOrderEntryOwner) {}

  override fun isValid(orderEntryId: String?, context: ConstraintValidatorContext): Boolean {
    val orderEntry = orderEntryRepository.findById(orderEntryId!!).get()
    val currentUser = userService.currentUser()

    return orderEntry.user == currentUser
  }
}
