package altszama.validation

import altszama.dish.DishRepository
import org.springframework.beans.factory.annotation.Autowired
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass


@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = arrayOf(DishExistsValidator::class))
annotation class DishExists(
    val message: String = "Dish doesn't exist.",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf()
)

class DishExistsValidator : ConstraintValidator<DishExists, String?> {

  @Autowired
  private lateinit var dishRepository: DishRepository

  override fun initialize(constraintAnnotation: DishExists) {}

  override fun isValid(dishId: String?, context: ConstraintValidatorContext): Boolean {
    return dishId != null && dishRepository.existsById(dishId)
  }
}