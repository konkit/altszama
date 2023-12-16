import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {RestaurantControllerService} from "../../../../frontend-client";
import {RestaurantFormService} from "./service/restaurant-form.service";

@Injectable({
  providedIn: 'root'
})
export class ShowRestaurantResolver  {

  constructor(private restaurantControllerService: RestaurantControllerService,
              private restaurantFormService: RestaurantFormService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    let id = route.paramMap.get('id');
    return this.restaurantFormService.loadRestaurantData(id!)
  }
}
