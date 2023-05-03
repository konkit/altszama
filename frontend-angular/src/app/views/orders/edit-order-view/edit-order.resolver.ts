import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {CreateOrderInitialData, EditOrderInitialData, OrderControllerService} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class EditOrderResolver implements Resolve<EditOrderInitialData> {
  constructor(private orderControllerService: OrderControllerService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EditOrderInitialData> {
    let id = route.paramMap.get('id')!;
    return this.orderControllerService.edit(id)
  }
}
