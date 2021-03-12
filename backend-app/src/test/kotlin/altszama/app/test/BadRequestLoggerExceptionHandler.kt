package altszama.app.test

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus

@ControllerAdvice
class BadRequestLoggerExceptionHandler {

  val logger = LoggerFactory.getLogger("debug")

  @ExceptionHandler
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  fun handle(e: HttpMessageNotReadableException?) {
    logger.warn("Returning HTTP 400 Bad Request", e)
    throw e!!
  }
}