import {Component} from '@angular/core';
import {map, Observable} from "rxjs";
import {RestaurantControllerService, RestaurantInfo} from "../../../../frontend-client";

@Component({
  selector: 'app-restaurants-list-view',
  templateUrl: './restaurants-list-view.component.html',
  styleUrls: ['./restaurants-list-view.component.scss']
})
export class RestaurantsListViewComponent {
  allRestaurants$: Observable<RestaurantInfo[]>;

  constructor(private api: RestaurantControllerService) {
    this.allRestaurants$ = this.api.indexRestaurants().pipe(
      map(r => r.restaurants)
    )
  }
}
