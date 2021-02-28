package altszama.app.auth;

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.MessageSource
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus

@ControllerAdvice
class UnauthorizedExceptionHandler
@Autowired constructor() {

  private val logger: Logger = LoggerFactory.getLogger(UnauthorizedExceptionHandler::class.java)

  @ExceptionHandler(UnauthorizedException::class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  @ResponseBody
  fun processValidationError(ex: UnauthorizedException) {
    logger.info("Unauthorized: ", ex)
  }
}
