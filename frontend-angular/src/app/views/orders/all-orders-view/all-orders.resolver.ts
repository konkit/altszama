import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AllOrdersResponse, OrderControllerService} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class AllOrdersResolver  {

  constructor(private orderControllerService: OrderControllerService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AllOrdersResponse> {
    return this.orderControllerService.allOrders()
  }
}
