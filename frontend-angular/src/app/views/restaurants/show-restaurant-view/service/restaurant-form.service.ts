import {Injectable} from '@angular/core';
import {BehaviorSubject, take} from "rxjs";
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../../frontend-client";
import {RestaurantEditorState} from "./restaurant-editor-state";

@Injectable({
  providedIn: 'root'
})
export class RestaurantFormService {

  editorStateSubject = new BehaviorSubject<RestaurantEditorState>({name: "IDLE"})

  restaurantData = new BehaviorSubject<ShowRestaurantResponse | null>(null)

  constructor(private restaurantControllerService: RestaurantControllerService) {
  }

  loadRestaurantData(restaurantId: string) {
    if (restaurantId != null) {
      this.restaurantControllerService.showRestaurant(restaurantId)
        .subscribe(response => this.restaurantData.next(response))
    }
  }

  setRestaurantAsEdited(restaurantId: string) {
    this.editorStateSubject.next({name: "EDITING_RESTAURANT", restaurantId: restaurantId})
  }

  setDishAsCreated(restaurantId: string) {
    this.editorStateSubject.next({name: "CREATING_DISH", restaurantId: restaurantId})
  }

  setDishAsEdited(restaurantId: string, dishId: string) {
    this.editorStateSubject.next({name: "EDITING_DISH", restaurantId: restaurantId, dishId: dishId})
  }

  refreshRestaurantData() {
    let editorStateValue = this.editorStateSubject.value;
    if (editorStateValue.name != "IDLE") {
      let restaurantId = editorStateValue.restaurantId
      this.loadRestaurantData(restaurantId)
      this.editorStateSubject.next({name: "IDLE"})
    }
  }
}
