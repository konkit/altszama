import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable, ReplaySubject, switchMap, take, tap, throwError} from "rxjs";
import {
  DishControllerService,
  RestaurantControllerService,
  ShowRestaurantResponse
} from "../../../../../frontend-client";
import {RestaurantEditorState} from "./restaurant-editor-state";
import {DialogService} from "../../../../service/dialog.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RestaurantFormService {

  editorStateSubject = new BehaviorSubject<RestaurantEditorState>({name: "IDLE"})

  loadedRestaurantData = new ReplaySubject<ShowRestaurantResponse>(1)

  constructor(private restaurantControllerService: RestaurantControllerService,
              private dialogService: DialogService,
              private router: Router,
              private dishControllerService: DishControllerService) {
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

  deleteDish(dishId: string) {
    this.dialogService.displayDeleteDialog("Delete dish?", "Are you sure you want to delete this dish?")
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            return this.dishControllerService.deleteDish(dishId)
          } else {
            return EMPTY
          }
        }),
        switchMap(() => this.refreshRestaurantData())
      )
      .subscribe();
  }

  deleteRestaurant(restaurantId: string) {
    this.dialogService.displayDeleteDialog("Delete restaurant?", "Are you sure you want to delete this restaurant?")
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            return this.restaurantControllerService.deleteRestaurant(restaurantId)
              .pipe(tap(() => {
                this.router.navigate(['/restaurants/'], {onSameUrlNavigation: "reload"})
              }))
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe()
  }
}
