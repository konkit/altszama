package altszama.dish.dto

import altszama.dish.Dish

data class EditResponse(
    var dish: Dish,
    var categories: List<String>
)