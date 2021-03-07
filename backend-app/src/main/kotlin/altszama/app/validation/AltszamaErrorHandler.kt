package altszama.app.validation;

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus


@ControllerAdvice
class AltszamaErrorHandler {

  @ExceptionHandler(AltszamaErrorException::class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ResponseBody
  fun processValidationError(ex: AltszamaErrorException): ErrorResponse {
    return ErrorResponse(ex.message)
  }
}
