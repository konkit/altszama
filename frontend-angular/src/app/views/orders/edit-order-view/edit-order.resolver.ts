import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {EditOrderInitialData, OrderControllerService} from "../../../../frontend-client";

@Injectable({
  providedIn: 'root'
})
export class EditOrderResolver  {
  constructor(private orderControllerService: OrderControllerService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EditOrderInitialData> {
    let id = route.paramMap.get('id')!;
    return this.orderControllerService.edit(id)
  }
}
