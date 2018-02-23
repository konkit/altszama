package altszama.validation

import altszama.restaurant.RestaurantRepository
import org.springframework.beans.factory.annotation.Autowired
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = arrayOf(RestaurantExistsValidator::class))
annotation class RestaurantExists(
    val message: String = "Restaurant doesn't exist.",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf()
)

class RestaurantExistsValidator : ConstraintValidator<RestaurantExists, String?> {

  @Autowired
  private lateinit var restaurantRepository: RestaurantRepository

  override fun initialize(constraintAnnotation: RestaurantExists) {}

  override fun isValid(restaurantId: String?, context: ConstraintValidatorContext): Boolean {
    return restaurantId != null && restaurantRepository.exists(restaurantId)
  }
}