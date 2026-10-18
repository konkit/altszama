import {Component, input} from '@angular/core';
import {RestaurantDto} from "../../../../../../frontend-client";
import {RelativeDatePipe} from '../../../../../components/pipes/date-to-rel.pipe';
import {MatIconModule} from '@angular/material/icon';

@Component({
    selector: 'app-restaurant-details',
    templateUrl: './restaurant-details.component.html',
    styleUrls: ['./restaurant-details.component.scss'],
    standalone: true,
    imports: [MatIconModule, RelativeDatePipe]
})
export class RestaurantDetailsComponent {
  readonly restaurant = input.required<RestaurantDto>();

  hasValue(value: string | null | undefined): boolean {
    return value != null && value.trim().length > 0
  }

  telLink(telephone: string) {
    return "tel:" + telephone.replace(/[^\d+]/g, "")
  }
}
