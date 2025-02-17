import {Component, OnInit} from '@angular/core';
import {EditOrderInitialData, OrderControllerService, OrderUpdateRequest} from "../../../../frontend-client";
import {map, Observable, take} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";
import {Title} from "@angular/platform-browser";
import {MatButtonModule} from '@angular/material/button';
import {PaymentDataFormComponent} from '../components/payment-data-form/payment-data-form.component';
import {DeliveryDataFormComponent} from '../components/delivery-data-form/delivery-data-form.component';
import {OrderTimeFormComponent} from '../components/order-time-form/order-time-form.component';
import {MatStepperModule} from '@angular/material/stepper';
import {AsyncPipe} from '@angular/common';
import {OrderStateButtonsComponent} from './components/order-state-buttons/order-state-buttons.component';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';

@Component({
    selector: 'app-edit-order-view',
    templateUrl: './edit-order-view.component.html',
    styleUrls: ['./edit-order-view.component.scss'],
    standalone: true,
    imports: [ViewWrapperComponent, OrderStateButtonsComponent, MatStepperModule, OrderTimeFormComponent, DeliveryDataFormComponent, PaymentDataFormComponent, MatButtonModule, AsyncPipe]
})
export class EditOrderViewComponent implements OnInit {

  orderId: string

  editOrderInitialData$: Observable<EditOrderInitialData>

  fb = new FormBuilder()
  orderForm = this.fb.nonNullable.group({
    orderDate: this.fb.nonNullable.control(""),
    timeOfOrder: this.fb.control("12:00"),
    timeOfDelivery: this.fb.control("14:00"),
    deliveryData: this.fb.nonNullable.group({
      decreaseInPercent: this.fb.nonNullable.control(0),
      deliveryCostPerEverybody: this.fb.nonNullable.control(0),
      deliveryCostPerDish: this.fb.nonNullable.control(0),
    }),
    paymentData: this.fb.nonNullable.group({
      paymentByCash: true,
      paymentByBankTransfer: false,
      bankTransferNumber: "",
      paymentByBlik: false,
      blikPhoneNumber: ""
    })
  })

  constructor(private route: ActivatedRoute,
              private orderControllerService: OrderControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private title: Title,
              private router: Router) {
    this.editOrderInitialData$ = this.route.data.pipe(map(x => x['response']))
    this.orderId = this.route.snapshot.paramMap.get("id")!
  }

  ngOnInit() {
    this.editOrderInitialData$.pipe(take(1)).subscribe(response => {
      this.setOrderFormInitialValue(response);
      this.title.setTitle(`Edit order from ${response.order.restaurantName} | AltSzama`)
    })
  }

  private setOrderFormInitialValue(response: EditOrderInitialData) {
    this.orderForm.setValue({
      orderDate: response.order.orderDate,
      timeOfOrder: response.order.timeOfOrder || null,
      timeOfDelivery: response.order.timeOfDelivery || null,
      deliveryData: response.order.deliveryData,
      paymentData: response.order.paymentData,
    })

    if (response.order.paymentData.paymentByBankTransfer) {
      this.orderForm.controls.paymentData.controls.paymentByBankTransfer.setValue(true);
      this.orderForm.controls.paymentData.controls.bankTransferNumber.setValue(response.order.paymentData.bankTransferNumber);
    }

    if (response.order.paymentData.paymentByBlik) {
      this.orderForm.controls.paymentData.controls.paymentByBlik.setValue(true);
      this.orderForm.controls.paymentData.controls.blikPhoneNumber.setValue(response.order.paymentData.blikPhoneNumber);
    }
  }

  submitForm(e: Event) {
    e.preventDefault();

    const order: OrderUpdateRequest = {
      orderId: this.orderId,
      orderDate: this.orderForm.controls.orderDate.value,
      timeOfOrder: this.toStringOrUndefined(this.orderForm.controls.timeOfOrder.value),
      timeOfDelivery: this.toStringOrUndefined(this.orderForm.controls.timeOfDelivery.value),
      deliveryData: {
        decreaseInPercent: this.orderForm.controls.deliveryData.controls.decreaseInPercent.value,
        deliveryCostPerEverybody: this.orderForm.controls.deliveryData.controls.deliveryCostPerEverybody.value,
        deliveryCostPerDish: this.orderForm.controls.deliveryData.controls.deliveryCostPerDish.value,
      },
      paymentData: {
        paymentByCash: this.orderForm.controls.paymentData.controls.paymentByCash.value,
        paymentByBankTransfer: this.orderForm.controls.paymentData.controls.paymentByBankTransfer.value,
        bankTransferNumber: this.orderForm.controls.paymentData.controls.bankTransferNumber.value,
        paymentByBlik: this.orderForm.controls.paymentData.controls.paymentByBlik.value,
        blikPhoneNumber: this.orderForm.controls.paymentData.controls.blikPhoneNumber.value,
      }
    };

    this.orderControllerService.update(order).subscribe({
      next: r => this.router.navigate(["/orders", this.orderId, 'show']),
      error: err => this.errorSnackBar.displayError(err)
    })

    return false;
  }

  toStringOrUndefined(value: string | null): string | undefined {
    if (value) {
      return value
    } else {
      return undefined
    }
  }

  cancelEdit() {
    this.router.navigate(["/orders", this.orderId, "show"])
  }
}
