import { Injectable } from '@angular/core';
import {BehaviorSubject, EMPTY, Observable} from "rxjs";
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../../frontend-client";
import {ActivatedRoute} from "@angular/router";

export enum RestaurantEditorState {
  IDLE = 1,
  EDITING_RESTAURANT,
  CREATING_DISH,
  EDITING_DISH
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantFormService {

  editorStateSubject = new BehaviorSubject<RestaurantEditorState>(RestaurantEditorState.IDLE)

  editedDishId = new BehaviorSubject<string>("")

  showRestaurantResponse = new BehaviorSubject<ShowRestaurantResponse | null>(null)


  constructor(private restaurantControllerService: RestaurantControllerService) { }

  setEditorState(newState: RestaurantEditorState) {
    this.editorStateSubject.next(newState)
  }

  loadRestaurant(id: string) {
    if (id != null) {
      this.restaurantControllerService.showRestaurant(id)
        .subscribe(response => this.showRestaurantResponse.next(response))
    }
  }

  setDishAsEdited(dishId: string) {
    this.editedDishId.next(dishId)
    this.setEditorState(RestaurantEditorState.EDITING_DISH)
  }

  refresh(restaurantId: string) {
      this.setEditorState(RestaurantEditorState.IDLE)
      this.loadRestaurant(restaurantId)
  }
}
