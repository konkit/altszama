import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ShowOrderResponse} from "../../../../frontend-client";
import {ShowOrderViewService} from "./service/show-order-view.service";

@Injectable({
  providedIn: 'root'
})
export class ShowOrderResolver  {

  constructor(private showOrderViewService: ShowOrderViewService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ShowOrderResponse> {
    let id = route.paramMap.get('id');
    return this.showOrderViewService.loadOrderResponseToAllSubjects(id)
  }
}
