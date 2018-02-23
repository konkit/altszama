package altszama.dish.data

import altszama.dish.Dish

data class EditDataResponse(
    var dish: Dish,
    var categories: List<String>
)