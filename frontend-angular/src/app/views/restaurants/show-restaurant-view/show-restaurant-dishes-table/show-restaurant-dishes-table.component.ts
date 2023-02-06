import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DishDto, RestaurantDto} from "../../../../../frontend-client";
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

  @Output() deleteDish: EventEmitter<string> = new EventEmitter();

  creatingDish: boolean = false

  faTimes = faTimes
  faPencil = faPencil;
  faAdd = faAdd;



  constructor(private fb: FormBuilder) {
  }

  sendDeleteDish(dishId: string) {
    this.deleteDish.emit(dishId)
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

  cancelCreatingDish() {
    this.creatingDish = false
  }

  submitCreateDishForm() {

  }
}
