import {Component, input} from '@angular/core';
import {RestaurantDto} from "../../../../../../frontend-client";
import {RelativeDatePipe} from '../../../../../components/pipes/date-to-rel.pipe';
import {MatListModule} from '@angular/material/list';

@Component({
    selector: 'app-restaurant-details',
    templateUrl: './restaurant-details.component.html',
    styleUrls: ['./restaurant-details.component.scss'],
    standalone: true,
    imports: [MatListModule, RelativeDatePipe]
})
export class RestaurantDetailsComponent {
  readonly restaurant = input.required<RestaurantDto>();
}
