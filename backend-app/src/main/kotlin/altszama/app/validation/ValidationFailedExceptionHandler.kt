package altszama.app.validation;

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.MessageSource
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus


@ControllerAdvice
class ValidationFailedExceptionHandler
@Autowired constructor(private val messageSource: MessageSource) {

  data class ErrorResult(val messages: List<String>)

  @ExceptionHandler(ValidationFailedException::class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ResponseBody
  fun processValidationError(ex: ValidationFailedException): ErrorResult {
    return ErrorResult(listOf(ex.message?: ""))
  }
}
