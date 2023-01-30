import {Component, OnInit} from '@angular/core';
import {AllOrdersOrderDto, OrderControllerService} from "../../../../frontend-client";
import {map, Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-all-orders-view',
  templateUrl: './all-orders-view.component.html',
  styleUrls: ['./all-orders-view.component.scss']
})
export class AllOrdersViewComponent implements OnInit {

  allOrders$: Observable<AllOrdersOrderDto[]>;

  constructor(private api: OrderControllerService, private route: ActivatedRoute) {
    this.allOrders$ = this.route.data.pipe(map(r => r['response'].allOrdersList))
  }

  ngOnInit(): void {

  }



}
