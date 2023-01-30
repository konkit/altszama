import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {AllOrdersResponse, OrderControllerService} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class AllOrdersResolver implements Resolve<AllOrdersResponse> {

  constructor(private orderControllerService: OrderControllerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AllOrdersResponse> {
    return this.orderControllerService.allOrders()
  }
}
