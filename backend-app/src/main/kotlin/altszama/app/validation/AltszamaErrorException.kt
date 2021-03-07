package altszama.app.validation

import java.lang.RuntimeException

sealed class AltszamaErrorException(override val message: String) : RuntimeException(message)

class RestaurantInUseException() : AltszamaErrorException("There are orders from this restaurant")
class NoAccessToRestaurant() : AltszamaErrorException("You have no access to this restaurant")
class RestaurantDoesNotExist() : AltszamaErrorException("Restaurant does not exist")
data class RestaurantDataInvalid(override val message: String) : AltszamaErrorException(message)

class UserDoesNotBelongToAnyTeam() : AltszamaErrorException("You don't belong to any team.")



class DishDoesNotExist() : AltszamaErrorException("Dish does not exist")
data class DishDataInvalid(override val message: String) : AltszamaErrorException(message)
class DishInUse() : AltszamaErrorException("Delete failed - there are order entries using this dish")
class SideDishInUse() : AltszamaErrorException("Delete failed - there are order entries using this side dish")
class SideDishDoesNotExist() : AltszamaErrorException("Side dish does not exist")
