import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {CreateOrderInitialData, OrderControllerService} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class CreateOrderResolver implements Resolve<CreateOrderInitialData> {

  constructor(private orderControllerService: OrderControllerService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CreateOrderInitialData> {
    return this.orderControllerService.create()
  }
}
