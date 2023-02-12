import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DishControllerService, DishDto, RestaurantDto} from "../../../../../frontend-client";
import * as moment from "moment";

import {faAdd, faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {RestaurantEditorState, RestaurantFormService} from "../service/restaurant-form.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  DeleteConfirmationModalComponent
} from "../../../../components/delete-confirmation-modal/delete-confirmation-modal.component";

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

  @Output() refreshDishes = new EventEmitter<void>();

  RestaurantEditorState = RestaurantEditorState

  faTimes = faTimes
  faPencil = faPencil;
  faAdd = faAdd;



  constructor(private dishControllerService: DishControllerService,
              private restaurantFormService: RestaurantFormService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  onDishDelete(dishId: string) {
    this.dialog.open(DeleteConfirmationModalComponent, {
      width: '250px',
      data: {
        content: "Are you sure you want to delete this dish?"
      }
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.dishControllerService.deleteDish(dishId).subscribe(response => {
          this.refresh()
        })

        this.snackBar.open('Deleted!', '', {
          duration: 2000,
        });
      }
    });
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

  onDishEditCancel() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
  }

  onDishEditSucceeded() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
    this.refresh()
  }

  setDishAsEdited(dishId: string) {
    this.restaurantFormService.setDishAsEdited(dishId)
  }
}
