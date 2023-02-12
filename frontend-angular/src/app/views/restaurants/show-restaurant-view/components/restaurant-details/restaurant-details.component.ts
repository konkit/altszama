import {Component, Input} from '@angular/core';
import {RestaurantDto} from "../../../../../../frontend-client";

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent {
  @Input() restaurant!: RestaurantDto
}
