import {Component, Input} from '@angular/core';
import {DishControllerService, DishDto, RestaurantDto} from "../../../../../../frontend-client";

import {faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {EMPTY, switchMap} from "rxjs";
import {DialogService} from "../../../../../service/dialog.service";
import {RestaurantEditorState} from "../../service/restaurant-editor-state";

@Component({
  selector: 'app-dish-entry',
  templateUrl: './dish-entry.component.html',
  styleUrls: ['./dish-entry.component.scss']
})
export class DishEntryComponent {
  @Input() restaurantEditorState!: RestaurantEditorState
  @Input() restaurant!: RestaurantDto;
  @Input() dish!: DishDto

  faTimes = faTimes
  faPencil = faPencil;


  constructor(private restaurantFormService: RestaurantFormService) {
  }

  editDish() {
    this.restaurantFormService.setDishAsEdited(this.dish.id)
  }

  deleteDish() {
    this.restaurantFormService.deleteDish(this.dish.id)
  }
}
