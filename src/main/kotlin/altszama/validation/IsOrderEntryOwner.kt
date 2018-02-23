package altszama.validation

import altszama.auth.AuthService
import altszama.orderEntry.OrderEntryRepository
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
  private lateinit var authService: AuthService

  @Autowired
  private lateinit var orderEntryRepository: OrderEntryRepository


  override fun initialize(constraintAnnotation: IsOrderEntryOwner) {}

  override fun isValid(orderEntryId: String?, context: ConstraintValidatorContext): Boolean {
    val orderEntry = orderEntryRepository.findOne(orderEntryId)
    val currentUser = authService.currentUser()

    return orderEntry.user == currentUser
  }
}