

export type RestaurantEditorState = IdleEditorState | EditingRestaurantState | CreatingDishState | EditingDishState

export interface IdleEditorState {
  name: "IDLE",
}

export interface EditingRestaurantState {
  name: "EDITING_RESTAURANT",
  restaurantId: string
}

export interface CreatingDishState {
  name: "CREATING_DISH",
  restaurantId: string
}

export interface EditingDishState {
  name: "EDITING_DISH",
  restaurantId: string
  dishId: string
}
