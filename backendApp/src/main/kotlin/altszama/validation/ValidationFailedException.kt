package altszama.validation;

data class ValidationFailedException(val errMsg: String) : RuntimeException(errMsg)
