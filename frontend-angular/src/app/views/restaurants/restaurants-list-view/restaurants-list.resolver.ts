import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {IndexResponse, RestaurantControllerService} from '../../../../frontend-client';

export const restaurantsListResolver: ResolveFn<IndexResponse> = (route, state) => {
  let restaurantControllerService = inject(RestaurantControllerService)
  return restaurantControllerService.indexRestaurants()
}
