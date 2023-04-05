import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {IndexResponse, RestaurantControllerService} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsListResolver implements Resolve<IndexResponse> {

  constructor(private restaurantControllerService: RestaurantControllerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IndexResponse> {
    return this.restaurantControllerService.indexRestaurants()
  }
}
