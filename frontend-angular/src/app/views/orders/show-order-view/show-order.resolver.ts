import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {OrderControllerService, ShowOrderResponse} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class ShowOrderResolver implements Resolve<ShowOrderResponse> {

  constructor(private orderControllerService: OrderControllerService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShowOrderResponse> {
    let id = route.paramMap.get('id');
    if (id != null) {
      return this.orderControllerService.show(id)
    } else {
      return EMPTY;
    }
  }
}
