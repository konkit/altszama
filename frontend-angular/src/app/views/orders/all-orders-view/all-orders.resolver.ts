import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {AllOrdersResponse, OrderControllerService} from '../../../../frontend-client';

export const allOrdersResolver: ResolveFn<AllOrdersResponse> = (route, state) => {
  let orderControllerService = inject(OrderControllerService)
  return orderControllerService.allOrders()
};
