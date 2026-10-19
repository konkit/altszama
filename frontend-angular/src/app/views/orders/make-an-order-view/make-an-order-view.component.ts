import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {OrderControllerService, OrderViewInitialData} from "../../../../frontend-client";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, shareReplay, take} from "rxjs";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";
import {Title} from "@angular/platform-browser";
import {PriceSummaryData} from "../lib/model";
import {orderStateToCaption, orderStateToTone} from "../lib/orderState";
import {UserOrdersComponent} from './components/user-orders/user-orders.component';
import {PriceSummaryComponent} from '../components/price-summary/price-summary.component';
import {NgxMatTimepickerComponent, NgxMatTimepickerDirective} from 'ngx-mat-timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AsyncPipe} from '@angular/common';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import {ChipComponent, ChipTone} from '../../../components/chip/chip.component';
import OrderStateEnum = OrderViewInitialData.OrderStateEnum;

interface PageData {
  initData: OrderViewInitialData
  priceSummaryData: PriceSummaryData
}

@Component({
    selector: 'app-make-an-order-view',
    templateUrl: './make-an-order-view.component.html',
    styleUrls: ['./make-an-order-view.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ViewWrapperComponent, ChipComponent, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, FormsModule, NgxMatTimepickerDirective, ReactiveFormsModule, NgxMatTimepickerComponent, PriceSummaryComponent, UserOrdersComponent, AsyncPipe, RouterLink]
})
export class MakeAnOrderViewComponent implements OnInit {
  orderControllerService = inject(OrderControllerService)
  errorSnackBar = inject(ErrorSnackBarService)
  route = inject(ActivatedRoute)
  router = inject(Router)
  title = inject(Title)

  protected readonly OrderStateEnum = OrderStateEnum;

  // Shared so the page title and the template don't each trigger their own request
  data$: Observable<PageData> = this.orderControllerService.orderViewJson(this.getOrderId()).pipe(
    map(r => {
      let priceSummaryData: PriceSummaryData = {
        totalPrice: r.totalPrice,
        basePriceSum: r.basePriceSum,
        allEatingPeopleCount: r.allEatingPeopleCount,
        deliveryData: r.orderDeliveryData,
      }
      return {initData: r, priceSummaryData}
    }),
    shareReplay(1)
  )

  fb = inject(FormBuilder)
  formGroup = this.fb.nonNullable.group({
    approxTimeOfDelivery: ""
  })

  isSaving = false

  ngOnInit() {
    this.data$.pipe(take(1)).subscribe(data => {
      this.title.setTitle(`Ordering from ${data.initData.restaurantName} | AltSzama`)
    })
  }

  unlockOrder() {
    this.isSaving = true
    this.orderControllerService.setAsCreated(this.getOrderId())
      .subscribe({
        next: () => this.goBack(),
        error: e => {
          this.isSaving = false
          this.errorSnackBar.displayError(e)
        }
      })
  }

  submitForm() {
    this.isSaving = true
    let setAsOrderedResponse = {approxTimeOfDelivery: this.formGroup.controls.approxTimeOfDelivery.value};
    this.orderControllerService.setAsOrdered(this.getOrderId(), setAsOrderedResponse)
      .subscribe({
        next: () => this.goBack(),
        error: e => {
          this.isSaving = false
          this.errorSnackBar.displayError(e)
        }
      })
  }

  telLink(telephone: string) {
    return "tel:" + telephone.replace(/[^\d+]/g, "")
  }

  getOrderStateString(orderState: OrderStateEnum): string {
    return orderStateToCaption(orderState)
  }

  getOrderStateTone(orderState: OrderStateEnum): ChipTone {
    return orderStateToTone(orderState)
  }

  getOrderId() {
    return this.route.snapshot.paramMap.get('id')!
  }

  goBack() {
    this.router.navigate(["/orders", this.getOrderId(), 'show'])
  }
}
