

export type RestaurantEditorState = IdleEditorState | EditingRestaurantState | CreatingDishState | EditingDishState

export interface IdleEditorState {
  name: "IDLE",
}

export interface EditingRestaurantState {
  name: "EDITING_RESTAURANT",
}

export interface CreatingDishState {
  name: "CREATING_DISH",
}

export interface EditingDishState {
  name: "EDITING_DISH",
  dishId: string
}
