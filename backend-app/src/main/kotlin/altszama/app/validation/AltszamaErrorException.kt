package altszama.app.validation

import org.springframework.http.HttpStatus

sealed class AltszamaErrorException(override val message: String,
                                    val responseStatus: HttpStatus = HttpStatus.BAD_REQUEST) : RuntimeException(message)

class RestaurantInUseException() : AltszamaErrorException("Dalete failed - delete all orders from this restaurant first")
class NoAccessToRestaurant() : AltszamaErrorException("You have no access to this restaurant")
class RestaurantDoesNotExist() : AltszamaErrorException("Restaurant does not exist")
data class RestaurantDataInvalid(override val message: String) : AltszamaErrorException(message)

class UserDoesNotBelongToAnyTeam() : AltszamaErrorException("You don't belong to any team.")



class DishDoesNotExist() : AltszamaErrorException("Dish does not exist")
data class DishDataInvalid(override val message: String) : AltszamaErrorException(message)
class DishInUse() : AltszamaErrorException("Delete failed - delete all orders using this dish first")
class SideDishInUse() : AltszamaErrorException("Delete failed - delete all orders using this side dish first")
class SideDishDoesNotExist() : AltszamaErrorException("Side dish does not exist")
class DishNameCannotBeBlank() : AltszamaErrorException("Dish name cannot be blank")
class DishPriceCannotBeBlankOrNegative() : AltszamaErrorException("Dish price cannot be blank or negative")
class SideDishNameCannotBeBlank() : AltszamaErrorException("Side dish name cannot be blank")
class SideDishPriceCannotBeBlankOrNegative() : AltszamaErrorException("Side dish price cannot be blank or negative")
class OrderIsLocked() : AltszamaErrorException("Order is locked - you cannot modify it now")

class OrderDoesNotExist() : AltszamaErrorException("Order does not exist")
class OrderEntryDoesNotExist() : AltszamaErrorException("Order entry does not exist")
class DishEntryDoesNotExist() : AltszamaErrorException("Dish entry does not exist")
class NoAccessToOrder() : AltszamaErrorException("You have no access to this order")
class NoAccessToOrderEntry() : AltszamaErrorException("You have no access to this order entry")
class OrderDateIsInvalid() : AltszamaErrorException("Order date is invalid")
class BankTransferNumberNotSpecified() : AltszamaErrorException("Bank transfer number is not specified")
class YouCanEditOnlyYourOwnOrders() : AltszamaErrorException("You can edit only your own orders")
class NoOrderEntriesInThisOrder() : AltszamaErrorException("There are no order entries in this order")

class InvalidOrderEntryId() : AltszamaErrorException("Field orderEntry id is invalid")
class InvalidDishEntryId() : AltszamaErrorException("Field dishEntryId is invalid")


class RestaurantImportNoApiKey() : AltszamaErrorException("Please use API Key provided on Restaurants page", HttpStatus.UNAUTHORIZED)
class RestaurantImportInvalidApiKey() : AltszamaErrorException("Invalid API Key", HttpStatus.UNAUTHORIZED)