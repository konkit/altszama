import {Component, Input} from '@angular/core';
import {DishControllerService, DishDto, RestaurantDto} from "../../../../../../frontend-client";
import * as moment from "moment";

import {faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {RestaurantEditorState, RestaurantFormService} from "../../service/restaurant-form.service";
import {EMPTY, switchMap} from "rxjs";
import {DialogService} from "../../../../../service/dialog.service";

@Component({
  selector: 'app-show-restaurant-dishes-table',
  templateUrl: './show-restaurant-dishes-table.component.html',
  styleUrls: ['./show-restaurant-dishes-table.component.scss']
})
export class ShowRestaurantDishesTableComponent {
  @Input() restaurantEditorState!: RestaurantEditorState
  @Input() editedDishId!: string | null;

  @Input() restaurant!: RestaurantDto;
  @Input() dishesByCategory!: { [key: string]: Array<DishDto> };

  RestaurantEditorState = RestaurantEditorState

  faTimes = faTimes
  faPencil = faPencil;


  constructor(private dishControllerService: DishControllerService,
              private restaurantFormService: RestaurantFormService,
              private dialogService: DialogService) {
  }

  onDishDelete(dishId: string) {
    this.dialogService.displayDeleteDialog("Are you sure you want to delete this dish?")
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            return this.dishControllerService.deleteDish(dishId)
          } else {
            return EMPTY
          }
        })
      )
      .subscribe(() => {
        this.restaurantFormService.refresh(this.restaurant.id)
      });
  }

  dateToRel(date: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }
  onDishEditCancel() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
  }

  onDishEditSucceeded() {
    this.restaurantFormService.refresh(this.restaurant.id)
  }

  setDishAsEdited(dishId: string) {
    this.restaurantFormService.setDishAsEdited(dishId)
  }
}
