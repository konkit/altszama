import {Component} from '@angular/core';
import {map, Observable} from "rxjs";
import {OrderControllerService, TodayOrdersResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-today-orders-view',
  templateUrl: './today-orders-view.component.html',
  styleUrls: ['./today-orders-view.component.scss']
})
export class TodayOrdersViewComponent {

  todaysOrders$: Observable<TodayOrdersResponse>;

  constructor(private api: OrderControllerService, private route: ActivatedRoute, private router: Router) {
    this.todaysOrders$ = this.route.data.pipe(map(x => x['response']))
  }

  goToOrder(selectedOrderId: string) {
    return this.router.navigate(["/orders/", selectedOrderId, 'show']);
    // router.push({name: "ShowOrder", params: {id: selectedOrderId}});
  }

  goToCreateOrder() {
    return this.router.navigate(["/orders/create"])
  }

}
