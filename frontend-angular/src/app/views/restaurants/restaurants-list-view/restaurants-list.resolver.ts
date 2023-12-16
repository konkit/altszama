import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {IndexResponse, RestaurantControllerService} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class RestaurantsListResolver  {

  constructor(private restaurantControllerService: RestaurantControllerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IndexResponse> {
    return this.restaurantControllerService.indexRestaurants()
  }
}
