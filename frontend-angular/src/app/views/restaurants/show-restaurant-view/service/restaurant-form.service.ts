import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable, ReplaySubject, switchMap, take, tap, throwError} from "rxjs";
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../../frontend-client";
import {RestaurantEditorState} from "./restaurant-editor-state";

@Injectable({
  providedIn: 'root'
})
export class RestaurantFormService {

  editorStateSubject = new BehaviorSubject<RestaurantEditorState>({name: "IDLE"})

  loadedRestaurantData = new ReplaySubject<ShowRestaurantResponse>(1)

  constructor(private restaurantControllerService: RestaurantControllerService) {
  }

  loadRestaurantData(restaurantId: string): Observable<any> {
    if (restaurantId != null) {
      return this.restaurantControllerService.showRestaurant(restaurantId)
        .pipe(
          tap(response => this.loadedRestaurantData.next(response))
        )
    } else {
      return throwError(() => new Error(`Missing restaurant ID`));
    }
  }

  setRestaurantAsEdited(restaurantId: string) {
    this.editorStateSubject.next({name: "EDITING_RESTAURANT"})
  }

  setDishAsCreated() {
    this.editorStateSubject.next({name: "CREATING_DISH"})
  }

  setDishAsEdited(dishId: string) {
    this.editorStateSubject.next({name: "EDITING_DISH", dishId: dishId})
  }

  refreshRestaurantData(): Observable<void> {
    return this.loadedRestaurantData
      .pipe(
        take(1),
        switchMap(restaurantData => {
          return this.loadRestaurantData(restaurantData.restaurant.id)
        }),
        tap(() => this.editorStateSubject.next({name: "IDLE"}))
      )
  }
}
