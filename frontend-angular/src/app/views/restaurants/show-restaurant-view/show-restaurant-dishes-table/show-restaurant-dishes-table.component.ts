import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DishControllerService, DishDto, RestaurantDto} from "../../../../../frontend-client";
import * as moment from "moment";

import {faAdd, faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {RestaurantEditorState, RestaurantFormService} from "../service/restaurant-form.service";

@Component({
  selector: 'app-show-restaurant-dishes-table',
  templateUrl: './show-restaurant-dishes-table.component.html',
  styleUrls: ['./show-restaurant-dishes-table.component.scss']
})
export class ShowRestaurantDishesTableComponent {
  @Input() restaurantEditorState!: RestaurantEditorState
  @Input() restaurant!: RestaurantDto;
  @Input() dishesByCategory!: { [key: string]: Array<DishDto> };

  @Output() refreshDishes = new EventEmitter<void>();

  RestaurantEditorState = RestaurantEditorState

  faTimes = faTimes
  faPencil = faPencil;
  faAdd = faAdd;



  constructor(private dishControllerService: DishControllerService, private restaurantFormService: RestaurantFormService) {
  }

  onDishDelete(dishId: string) {
    this.dishControllerService.deleteDish(dishId).subscribe(response => {
      this.refresh()
    })
  }

  dateToRel(date: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }

  createDish() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.CREATING_DISH)
  }

  onDishCreateCancel() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
  }

  onDishCreateSucceded() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
    this.refresh()
  }

  refresh() {
    this.refreshDishes.emit()
  }
}
