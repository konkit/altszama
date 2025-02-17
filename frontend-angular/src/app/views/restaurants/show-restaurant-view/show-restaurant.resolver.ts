import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {RestaurantFormService} from "./service/restaurant-form.service";

export const showRestaurantResolver: ResolveFn<string> = (route, state) => {
  const restaurantFormService = inject(RestaurantFormService);
  let id = route.paramMap.get('id');
  return restaurantFormService.loadRestaurantData(id!)
};
