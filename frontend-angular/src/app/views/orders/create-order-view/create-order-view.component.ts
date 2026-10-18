import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {map, Observable, take} from "rxjs";
import {
  CreateOrderInitialData,
  OrderControllerService,
  OrderSaveRequest,
  RestaurantDto
} from "../../../../frontend-client";
import {FormBuilder, Validators} from "@angular/forms";
import {bankTransferNumberValidators, blikPhoneNumberValidators, discountInPercentValidators} from "../lib/orderFormValidators";
import {ErrorSnackBarService} from "../../../service/error-snack-bar.service";
import {MatButtonModule} from '@angular/material/button';
import {MatListModule, MatSelectionListChange} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';
import {OrderDetailsFormComponent} from '../components/order-details-form/order-details-form.component';

@Component({
    selector: 'app-create-order-view',
    templateUrl: './create-order-view.component.html',
    styleUrls: ['./create-order-view.component.scss'],
    standalone: true,
  imports: [ViewWrapperComponent, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatListModule, MatButtonModule, OrderDetailsFormComponent, RouterLink]
})
export class CreateOrderViewComponent implements OnInit {

  fullRestaurantsList: RestaurantDto[] = [];
  restaurantsFilter: string = "";

  createOrderInitialData$: Observable<CreateOrderInitialData>

  isPaymentDataPrefilled = false
  isSaving = false

  fb = new FormBuilder()
  orderForm = this.fb.nonNullable.group({
    restaurantId: this.fb.nonNullable.control("", Validators.required),
    orderDate: this.fb.nonNullable.control(""),
    timeOfOrder: this.fb.nonNullable.control("14:00"),
    deliveryData: this.fb.nonNullable.group({
      decreaseInPercent: this.fb.nonNullable.control(0, discountInPercentValidators),
      deliveryCostPerEverybody: this.fb.nonNullable.control(0),
      deliveryCostPerDish: this.fb.nonNullable.control(0),
    }),
    paymentData: this.fb.nonNullable.group({
      paymentByCash: true,
      paymentByBankTransfer: false,
      bankTransferNumber: this.fb.nonNullable.control("", bankTransferNumberValidators),
      paymentByBlik: false,
      blikPhoneNumber: this.fb.nonNullable.control("", blikPhoneNumberValidators)
    })
  })

  constructor(private route: ActivatedRoute,
              private orderControllerService: OrderControllerService,
              private errorSnackBar: ErrorSnackBarService,
              private router: Router) {
    this.createOrderInitialData$ = this.route.data.pipe(map(x => x['response']))
  }

  ngOnInit() {
    this.createOrderInitialData$.pipe(take(1)).subscribe(response => {
      this.fullRestaurantsList = response.restaurantsList;
      this.setOrderFormInitialValue(response);
    })
  }

  private setOrderFormInitialValue(response: CreateOrderInitialData) {
    // No restaurant is preselected, so an order can't be created for the wrong one by accident
    this.orderForm.setValue({
      restaurantId: "",
      orderDate: response.orderDate,
      timeOfOrder: response.timeOfOrder,
      deliveryData: {
        decreaseInPercent: 0,
        deliveryCostPerEverybody: 0,
        deliveryCostPerDish: 0
      },
      paymentData: {
        paymentByCash: true,
        paymentByBankTransfer: false,
        bankTransferNumber: "",
        paymentByBlik: false,
        blikPhoneNumber: ""
      }
    })

    if (response.bankTransferNumber) {
      this.orderForm.controls.paymentData.controls.paymentByBankTransfer.setValue(true);
      this.orderForm.controls.paymentData.controls.bankTransferNumber.setValue(response.bankTransferNumber);
      this.isPaymentDataPrefilled = true
    }

    if (response.blikPhoneNumber) {
      this.orderForm.controls.paymentData.controls.paymentByBlik.setValue(true);
      this.orderForm.controls.paymentData.controls.blikPhoneNumber.setValue(response.blikPhoneNumber);
      this.isPaymentDataPrefilled = true
    }
  }

  filteredRestaurants(): RestaurantDto[] {
    const filter = this.restaurantsFilter.trim().toLowerCase()
    if (filter === "") {
      return this.fullRestaurantsList
    }
    return this.fullRestaurantsList.filter(r => r.name?.toLowerCase().includes(filter))
  }

  filterChanged(newFilterEvent: Event) {
    this.restaurantsFilter = (newFilterEvent.target as HTMLInputElement).value
  }

  clearFilter() {
    this.restaurantsFilter = ""
  }

  onRestaurantSelected(event: MatSelectionListChange) {
    const restaurantId = event.options.find(o => o.selected)?.value ?? ""
    this.orderForm.controls.restaurantId.setValue(restaurantId)
    this.orderForm.controls.restaurantId.markAsTouched()
  }

  isRestaurantMissing() {
    const control = this.orderForm.controls.restaurantId
    return control.touched && control.invalid
  }

  submitForm(e: Event) {
    e.preventDefault();

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched()
      return false;
    }

    const order: OrderSaveRequest = {
      restaurantId: this.orderForm.controls.restaurantId.value,
      orderDate: this.orderForm.controls.orderDate.value,
      timeOfOrder: this.orderForm.controls.timeOfOrder.value,
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

    this.isSaving = true
    this.orderControllerService.save(order).subscribe({
      next: r => this.router.navigate(["/orders", r.orderId, 'show']),
      error: err => {
        this.isSaving = false
        this.errorSnackBar.displayError(err)
      }
    })

    return false;
  }

  backToTodayOrders() {
    this.router.navigate(["/orders/today"])
  }
}
