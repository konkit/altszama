import {Component, OnInit} from '@angular/core';
import {
  OrderControllerService,
  ParticipantsOrderEntry,
  ShowOrderDto,
  ShowOrderResponse
} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {map, Observable, switchMap} from "rxjs";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-show-order-view',
  templateUrl: './show-order-view.component.html',
  styleUrls: ['./show-order-view.component.scss']
})
export class ShowOrderViewComponent implements OnInit {

  orderResponse$: Observable<ShowOrderResponse>

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orderControllerService: OrderControllerService) {
    this.orderResponse$ = this.route.data.pipe(map(r => r['response']))
  }

  ngOnInit() {
  }

  shouldShowOrderLockedWarning() {
    return false;
  }

}
