import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {OrderControllerService, TodayOrdersResponse} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class TodayOrdersResolver  {

  constructor(private orderControllerService: OrderControllerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TodayOrdersResponse> {
    return this.orderControllerService.todayOrders()
  }
}
