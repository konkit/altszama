import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {RestaurantControllerService} from "../../../../frontend-client";
import {RestaurantFormService} from "./service/restaurant-form.service";

@Injectable({
  providedIn: 'root'
})
export class ShowRestaurantResolver implements Resolve<string> {

  constructor(private restaurantControllerService: RestaurantControllerService,
              private restaurantFormService: RestaurantFormService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    let id = route.paramMap.get('id');
    return this.restaurantFormService.loadRestaurantData(id!)
  }
}
