import {Component, Input, input} from '@angular/core';
import {DishDto, RestaurantDto} from "../../../../../../frontend-client";
import {RestaurantFormService} from "../../service/restaurant-form.service";
import {RestaurantEditorState} from "../../service/restaurant-editor-state";
import {RelativeDatePipe} from '../../../../../components/pipes/date-to-rel.pipe';
import {PricePipe} from '../../../../../components/pipes/price.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';


@Component({
    selector: 'app-dish-entry',
    templateUrl: './dish-entry.component.html',
    styleUrls: ['./dish-entry.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, PricePipe, RelativeDatePipe]
})
export class DishEntryComponent {
  @Input() restaurantEditorState!: RestaurantEditorState
  readonly restaurant = input.required<RestaurantDto>();
  @Input() dish!: DishDto

  constructor(private restaurantFormService: RestaurantFormService) {
  }

  editDish() {
    this.restaurantFormService.setDishAsEdited(this.dish.id)
  }

  deleteDish() {
    this.restaurantFormService.deleteDish(this.dish.id)
  }
}
