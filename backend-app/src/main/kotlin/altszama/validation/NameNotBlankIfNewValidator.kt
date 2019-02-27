package altszama.validation

import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass


@Target(AnnotationTarget.CLASS)
@Constraint(validatedBy = arrayOf(NameNotBlankIfNewValidator::class))
annotation class NameNotBlankIfNew(
    val message: String = "Name must not be blank",
    val groups: Array<KClass<Any>> = arrayOf(),
    val payload: Array<KClass<out Payload>> = arrayOf(),
    val newDishName: String,
    val newDish: String
)

class NameNotBlankIfNewValidator : ConstraintValidator<NameNotBlankIfNew, Any> {

  private lateinit var newDishNameFieldName: String
  private lateinit var newDishFieldName: String

  override fun initialize(constraintAnnotation: NameNotBlankIfNew) {
    this.newDishNameFieldName = constraintAnnotation.newDishName
    this.newDishFieldName = constraintAnnotation.newDish
  }

  override fun isValid(cmdObj: Any, context: ConstraintValidatorContext): Boolean {
    val clazz: Class<Any> = cmdObj.javaClass

    val newDishName = getFieldValue(newDishNameFieldName, cmdObj, clazz) as String?
    val newDish = getFieldValue(newDishFieldName, cmdObj, clazz) as Boolean?

    return newDish == null || newDish == false || newDishName?.isNotBlank() == true
  }

  private fun getFieldValue(fieldName: String, obj: Any, clazz: Class<Any>): Any? {
    val field = clazz.getDeclaredField(fieldName)
    field.isAccessible = true
    return field.get(obj)
  }
}