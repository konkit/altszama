import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CreateOrderInitialData, OrderControllerService} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class CreateOrderResolver  {

  constructor(private orderControllerService: OrderControllerService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CreateOrderInitialData> {
    return this.orderControllerService.create()
  }
}
