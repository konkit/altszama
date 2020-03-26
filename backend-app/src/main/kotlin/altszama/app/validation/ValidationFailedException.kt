package altszama.app.validation;

data class ValidationFailedException(val errMsg: String) : RuntimeException(errMsg)
