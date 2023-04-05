import {Component} from '@angular/core';
import {EditOrderInitialData, OrderControllerService, OrderUpdateRequest} from "../../../../frontend-client";
import {map, Observable, take} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";

@Component({
  selector: 'app-edit-order-view',
  templateUrl: './edit-order-view.component.html',
  styleUrls: ['./edit-order-view.component.scss']
})
export class EditOrderViewComponent {

  orderId: string

  editOrderInitialData$: Observable<EditOrderInitialData>

  fb = new FormBuilder()
  orderForm = this.fb.nonNullable.group({
    orderDate: this.fb.nonNullable.control(""),
    timeOfOrder: this.fb.control("14:00"),
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
              private router: Router) {
    this.editOrderInitialData$ = this.route.data.pipe(map(x => x['response']))
    this.orderId = this.route.snapshot.paramMap.get("id")!
  }

  ngOnInit() {
    this.editOrderInitialData$.pipe(take(1)).subscribe(response => {
      // this.restaurantsTableDataSource.data = this.fullRestaurantsList;
      this.setOrderFormInitialValue(response);
    })
  }

  private setOrderFormInitialValue(response: EditOrderInitialData) {
    this.orderForm.setValue({
      orderDate: response.order.orderDate,
      timeOfOrder: response.order.timeOfOrder || null,
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
