package altszama.app.validation

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.context.request.WebRequest
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import org.springframework.web.bind.annotation.ControllerAdvice


data class ErrorMessages(val messages: List<String>)

@ControllerAdvice
class MethodArgumentInvalidExceptionHandler : ResponseEntityExceptionHandler() {

  override fun handleMethodArgumentNotValid(ex: MethodArgumentNotValidException, headers: HttpHeaders, status: HttpStatus, request: WebRequest): ResponseEntity<Any> {
    val bindingResult = ex.bindingResult

    val apiFieldErrors = bindingResult.fieldErrors.map { fieldError ->
      fieldError.defaultMessage
    }

    val apiGlobalErrors = bindingResult.globalErrors.map { globalError ->
      globalError.defaultMessage
    }

    val errorMessagesList = (apiFieldErrors  + apiGlobalErrors).filterNotNull()

    return ResponseEntity(ErrorMessages(errorMessagesList), HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
