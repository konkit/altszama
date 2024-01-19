import {Component, OnInit} from '@angular/core';
import {OrderControllerService, OrderViewInitialData} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {combineLatest, map, Observable, take} from "rxjs";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";
import {Title} from "@angular/platform-browser";
import {PriceSummaryData} from "../lib/model";

interface PageData {
  initData: OrderViewInitialData
  priceSummaryData: PriceSummaryData
}

@Component({
  selector: 'app-make-an-order-view',
  templateUrl: './make-an-order-view.component.html',
  styleUrls: ['./make-an-order-view.component.scss']
})
export class MakeAnOrderViewComponent implements OnInit {

  response$ = this.orderControllerService.orderViewJson(this.getOrderId())
  priceSummaryInput$ = this.response$.pipe(map(r => {
    let priceSummaryInput: PriceSummaryData = {
      totalPrice: r.totalPrice,
      basePriceSum: r.basePriceSum,
      allEatingPeopleCount: r.allEatingPeopleCount,
      deliveryData: r.orderDeliveryData,
    }
    return priceSummaryInput
  }))

  formGroup = this.fb.nonNullable.group({
    approxTimeOfDelivery: ""
  })

  data$!: Observable<PageData>;

  constructor(private orderControllerService: OrderControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private title: Title) {
  }

  ngOnInit() {
    this.response$.pipe(take(1)).subscribe(response => {
      this.title.setTitle(`Ordering from ${response.restaurantName} | AltSzama`)
    })

    this.data$ = combineLatest([this.response$, this.priceSummaryInput$]).pipe(
      map(([orderViewData, priceSummaryData]) => {
        return {initData: orderViewData, priceSummaryData}
      })
    )
  }

  unlockOrder() {
    this.orderControllerService.setAsCreated(this.getOrderId())
      .subscribe({
        next: () => this.goBack(),
        error: e => this.errorSnackBar.displayError(e)
      })
  }

  submitForm() {
    let setAsOrderedResponse = {approxTimeOfDelivery: this.formGroup.controls.approxTimeOfDelivery.value};
    this.orderControllerService.setAsOrdered(setAsOrderedResponse, this.getOrderId())
      .subscribe({
        next: () => this.goBack(),
        error: e => this.errorSnackBar.displayError(e)
      })
  }

  getOrderId() {
    return this.route.snapshot.paramMap.get('id')!
  }

  goBack() {
    this.router.navigate(["/orders", this.getOrderId(), 'show'])
  }
}
