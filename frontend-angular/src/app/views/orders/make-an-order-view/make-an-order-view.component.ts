import {Component, OnInit} from '@angular/core';
import {OrderControllerService} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {map} from "rxjs";
import {PriceSummaryInput} from "../show-order-view/components/price-summary/price-summary.component";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";

@Component({
  selector: 'app-make-an-order-view',
  templateUrl: './make-an-order-view.component.html',
  styleUrls: ['./make-an-order-view.component.scss']
})
export class MakeAnOrderViewComponent implements OnInit {

  response$ = this.orderControllerService.orderViewJson(this.getOrderId())
  priceSummaryInput$ = this.response$.pipe(map(r => {
    let priceSummaryInput: PriceSummaryInput = {
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

  constructor(private orderControllerService: OrderControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
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
