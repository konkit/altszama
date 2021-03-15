package altszama.app.validation;

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody


@ControllerAdvice
class AltszamaErrorHandler {

  @ExceptionHandler(AltszamaErrorException::class)
  @ResponseBody
  fun processValidationError(ex: AltszamaErrorException): ResponseEntity<ErrorResponse> {
    return ResponseEntity(ErrorResponse(ex.message), ex.responseStatus)
  }
}
