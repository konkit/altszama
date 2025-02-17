import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {OrderControllerService, TodayOrdersResponse} from '../../../../frontend-client';

export const todayOrdersResolver: ResolveFn<TodayOrdersResponse> = (route, state) => {
  let orderControllerService = inject(OrderControllerService)
  return orderControllerService.todayOrders()
};
