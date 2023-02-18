import {Component, OnInit} from '@angular/core';
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../frontend-client";
import {Router} from "@angular/router";
import {filter, Observable} from "rxjs";
import {faAdd, faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {RestaurantFormService} from "./service/restaurant-form.service";
import {isNotNull} from "../../../lib/utils";
import {DialogService} from "../../../service/dialog.service";
import {RestaurantEditorState} from "./service/restaurant-editor-state";


@Component({
  selector: 'app-show-restaurant-view',
  templateUrl: './show-restaurant-view.component.html',
  styleUrls: ['./show-restaurant-view.component.scss']
})
export class ShowRestaurantViewComponent {

  restaurant$: Observable<ShowRestaurantResponse>

  restaurantState$: Observable<RestaurantEditorState>

  faPencil = faPencil;
  faTimes = faTimes;
  faAdd = faAdd;


  constructor(private restaurantFormService: RestaurantFormService) {
    this.restaurant$ = this.restaurantFormService.loadedRestaurantData.asObservable().pipe(filter(isNotNull));
    this.restaurantState$ = this.restaurantFormService.editorStateSubject.asObservable()
  }

  editRestaurant(restaurantId: string) {
    this.restaurantFormService.setRestaurantAsEdited(restaurantId)
  }

  deleteRestaurant(restaurantId: string) {
    this.restaurantFormService.deleteRestaurant(restaurantId)
  }

  createDish() {
    this.restaurantFormService.setDishAsCreated()
  }
}
