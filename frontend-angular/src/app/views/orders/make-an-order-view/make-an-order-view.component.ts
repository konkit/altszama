import {Component, OnInit} from '@angular/core';
import {faArrowLeft, faLock, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {OrderControllerService} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {map} from "rxjs";
import {PriceSummaryInput} from "../show-order-view/components/price-summary/price-summary.component";

@Component({
  selector: 'app-make-an-order-view',
  templateUrl: './make-an-order-view.component.html',
  styleUrls: ['./make-an-order-view.component.scss']
})
export class MakeAnOrderViewComponent implements OnInit {
  faLock = faLock;
  faArrowBack = faArrowLeft;
  faArrowRight = faArrowRight;

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
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    // let orderId = this.route.snapshot.paramMap.get('id')!;
    //
    //   this.orderControllerService.orderViewJson(orderId).subscribe(response => {
    //
    //   })
    //     .then(responseObj => {
    //       this.orderState = responseObj.orderState.toString();
    //       this.orderDecreaseInPercent =
    //         responseObj.orderDeliveryData.decreaseInPercent;
    //       this.orderDeliveryCostPerEverybody =
    //         responseObj.orderDeliveryData.deliveryCostPerEverybody;
    //       this.orderDeliveryCostPerDish =
    //         responseObj.orderDeliveryData.deliveryCostPerDish;
    //       this.restaurantName = responseObj.restaurantName;
    //       this.restaurantTelephone = responseObj.restaurantTelephone;
    //       this.groupedEntries = responseObj.groupedEntries;
    //       this.allEatingPeopleCount = responseObj.allEatingPeopleCount;
    //       this.basePriceSum = responseObj.basePriceSum;
    //       this.totalPrice = responseObj.totalPrice;
    //
    //       this.$store.commit("setLoadingFalse");
    //       this.$store.commit("setTitle", `Ordering from ${this.restaurantName}`)
    //     })
    //     .catch(errResponse => ErrorHandler.handleError(errResponse));
    // }
  }

  unlockOrder() {

  }

  submitForm() {
    let setAsOrderedResponse = {approxTimeOfDelivery: this.formGroup.controls.approxTimeOfDelivery.value};
    this.orderControllerService.setAsOrdered(setAsOrderedResponse, this.getOrderId())
      .subscribe({
        next: () => this.goBack(),
        error: e => this.formGroup.setErrors(e)
      })
  }

  getOrderId() {
    return this.route.snapshot.paramMap.get('id')!
  }

  goBack() {
    this.router.navigate(["/orders", this.getOrderId(), 'show'])
  }
}
