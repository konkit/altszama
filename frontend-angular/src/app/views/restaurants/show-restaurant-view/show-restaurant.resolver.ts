import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class ShowRestaurantResolver implements Resolve<ShowRestaurantResponse> {

  constructor(private restaurantControllerService: RestaurantControllerService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShowRestaurantResponse> {
    let id = route.paramMap.get('id');
    if (id != null) {
      return this.restaurantControllerService.showRestaurant(id);
    } else {
      return EMPTY;
    }
  }
}
