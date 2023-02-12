import {Component, Input} from '@angular/core';
import {DishControllerService, DishDto, RestaurantDto} from "../../../../../../frontend-client";
import * as moment from "moment";

import {faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {EMPTY, switchMap} from "rxjs";
import {DialogService} from "../../../../../service/dialog.service";
import {RestaurantEditorState} from "../../service/restaurant-editor-state";

@Component({
  selector: 'app-restaurant-category-entries',
  templateUrl: './restaurant-category-entries.component.html',
  styleUrls: ['./restaurant-category-entries.component.scss']
})
export class RestaurantCategoryEntriesComponent {
  @Input() restaurantEditorState!: RestaurantEditorState
  @Input() restaurant!: RestaurantDto;

  @Input() category!: string
  @Input() dishes!: DishDto[]

  faTimes = faTimes
  faPencil = faPencil;


  constructor(private dishControllerService: DishControllerService,
              private restaurantFormService: RestaurantFormService,
              private dialogService: DialogService) {
  }

  deleteDish(dishId: string) {
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
        this.restaurantFormService.refreshRestaurantData()
      });
  }

  dateToRel(date: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }

  onDishEditSucceeded() {
    this.restaurantFormService.refreshRestaurantData()
  }

  editDish(dishId: string) {
    this.restaurantFormService.setDishAsEdited(this.restaurant.id, dishId)
  }
}
