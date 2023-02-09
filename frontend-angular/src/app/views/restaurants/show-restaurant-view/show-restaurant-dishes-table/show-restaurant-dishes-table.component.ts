import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DishControllerService, DishDto, RestaurantDto} from "../../../../../frontend-client";
import * as moment from "moment";

import {faTimes, faPencil, faAdd} from "@fortawesome/free-solid-svg-icons";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-show-restaurant-dishes-table',
  templateUrl: './show-restaurant-dishes-table.component.html',
  styleUrls: ['./show-restaurant-dishes-table.component.scss']
})
export class ShowRestaurantDishesTableComponent {
  @Input() restaurant!: RestaurantDto;
  @Input() dishesByCategory!: { [key: string]: Array<DishDto> };

  @Output() refreshDishes = new EventEmitter<void>();

  creatingDish: boolean = false

  faTimes = faTimes
  faPencil = faPencil;
  faAdd = faAdd;



  constructor(private dishControllerService: DishControllerService) {
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
    this.creatingDish = true
  }

  onDishCreateCancel() {
    this.creatingDish = false
  }

  onDishCreateSucceded() {
    this.creatingDish = false
    this.refresh()
  }

  refresh() {
    this.refreshDishes.emit()
  }
}
