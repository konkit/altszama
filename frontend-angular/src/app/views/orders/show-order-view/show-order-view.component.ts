import {Component, OnInit} from '@angular/core';
import {OrderControllerService, ShowOrderDto, ShowOrderResponse} from "../../../../frontend-client";
import {ActivatedRoute} from "@angular/router";
import {map, Observable, switchMap} from "rxjs";

@Component({
  selector: 'app-show-order-view',
  templateUrl: './show-order-view.component.html',
  styleUrls: ['./show-order-view.component.scss']
})
export class ShowOrderViewComponent implements OnInit {

  order$: Observable<ShowOrderResponse>

  constructor(private route: ActivatedRoute,
              private orderControllerService: OrderControllerService) {
    this.order$ = this.route.params.pipe(
      switchMap(params => {
        return this.orderControllerService.show(params["id"])
      }),
    )
  }

  ngOnInit() {

  }

  shouldShowOrderLockedWarning() {
    return false;
  }

  allEatingPeopleCount(orderResponse: ShowOrderResponse) {
    return orderResponse.orderEntries.flatMap(e => e.dishEntries).length;
  }
}
