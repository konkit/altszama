package altszama.app.validation

import java.lang.RuntimeException

sealed class AltszamaErrorException(override val message: String) : RuntimeException(message)

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
