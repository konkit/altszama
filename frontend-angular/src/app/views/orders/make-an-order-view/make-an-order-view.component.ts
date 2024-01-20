import {Component, OnInit} from '@angular/core';
import {OrderControllerService, OrderViewInitialData} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {combineLatest, map, Observable, take} from "rxjs";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";
import {Title} from "@angular/platform-browser";
import {PriceSummaryData} from "../lib/model";
import {UserOrdersComponent} from './components/user-orders/user-orders.component';
import {PriceSummaryComponent} from '../components/price-summary/price-summary.component';
import {NgxMatTimepickerComponent, NgxMatTimepickerDirective} from 'ngx-mat-timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {AsyncPipe} from '@angular/common';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';

interface PageData {
  initData: OrderViewInitialData
  priceSummaryData: PriceSummaryData
}

@Component({
    selector: 'app-make-an-order-view',
    templateUrl: './make-an-order-view.component.html',
    styleUrls: ['./make-an-order-view.component.scss'],
    standalone: true,
    imports: [ViewWrapperComponent, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, NgxMatTimepickerDirective, ReactiveFormsModule, NgxMatTimepickerComponent, PriceSummaryComponent, UserOrdersComponent, AsyncPipe]
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
