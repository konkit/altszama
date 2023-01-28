import {Component, OnInit} from '@angular/core';
import {AllOrdersOrderDto, OrderControllerService} from "../../../../frontend-client";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-all-orders-view',
  templateUrl: './all-orders-view.component.html',
  styleUrls: ['./all-orders-view.component.scss']
})
export class AllOrdersViewComponent implements OnInit {

  allOrders$: Observable<AllOrdersOrderDto[]>;

  constructor(private api: OrderControllerService) {
    this.allOrders$ = this.api.allOrders().pipe(
      map(r => r.allOrdersList)
    )
  }

  ngOnInit(): void {

  }



}
