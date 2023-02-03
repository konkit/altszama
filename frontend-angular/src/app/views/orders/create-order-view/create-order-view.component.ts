import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, map, Observable, take} from "rxjs";
import {
  CreateOrderInitialData,
  OrderControllerService,
  OrderSaveRequest,
  RestaurantDto
} from "../../../../frontend-client";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

export interface PriceModifierFieldsValue {
  decreaseInPercent: number;
  deliveryCostPerEverybody: number;
  deliveryCostPerDish: number;
}

export interface PaymentDataFieldsValue {
  paymentByCash: boolean;
  paymentByBankTransfer: boolean;
  bankTransferNumber: string;
  paymentByBlik: boolean;
  blikPhoneNumber: string;
}

@Component({
  selector: 'app-create-order-view',
  templateUrl: './create-order-view.component.html',
  styleUrls: ['./create-order-view.component.scss']
})
export class CreateOrderViewComponent implements OnInit {

  fullRestaurantsList: RestaurantDto[] = [];
  filteredRestaurantsList$ = new BehaviorSubject<RestaurantDto[]>([]);

  fb = new FormBuilder()
  orderForm = this.fb.nonNullable.group({
    restaurantId: this.fb.nonNullable.control(""),
    orderDate: this.fb.nonNullable.control(""),
    timeOfOrder: this.fb.nonNullable.control("14:00"),
    deliveryData: this.fb.nonNullable.group({
      decreaseInPercent: this.fb.nonNullable.control(0),
      deliveryCostPerEverybody:  this.fb.nonNullable.control(0),
      deliveryCostPerDish:  this.fb.nonNullable.control(0),
    }),
    paymentData: this.fb.nonNullable.group<PaymentDataFieldsValue>({
      paymentByCash: true,
      paymentByBankTransfer: false,
      bankTransferNumber: "",
      paymentByBlik: false,
      blikPhoneNumber: ""
    })
  })

  // priceModifiersFormGroup = this.fb.nonNullable.group({
  //   decreaseInPercent: this.fb.nonNullable.control(0),
  //   deliveryCostPerEverybody:  this.fb.nonNullable.control(0),
  //   deliveryCostPerDish:  this.fb.nonNullable.control(0),
  // })

  // paymentDataFormGroup =this.fb.nonNullable.group<PaymentDataFieldsValue>({
  //   paymentByCash: true,
  //   paymentByBankTransfer: false,
  //   bankTransferNumber: "",
  //   paymentByBlik: false,
  //   blikPhoneNumber: ""
  // })

  createOrderInitialData$: Observable<CreateOrderInitialData>
  restaurantsFilter: string = "";

  constructor(private route: ActivatedRoute,
              private orderControllerService: OrderControllerService,
              private router: Router) {
    this.createOrderInitialData$ = this.route.data.pipe(map(x => x['response']))
  }

  ngOnInit() {
    this.createOrderInitialData$.pipe(take(1)).subscribe(response => {
      const restaurantId =
        (response.restaurantsList &&
          response.restaurantsList[0] &&
          response.restaurantsList[0].id) ||
        "";

      this.fullRestaurantsList = response.restaurantsList;
      this.filteredRestaurantsList$.next(this.fullRestaurantsList);

      this.orderForm.setValue({
        restaurantId: restaurantId,
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
      }

      if (response.blikPhoneNumber) {
        this.orderForm.controls.paymentData.controls.paymentByBlik.setValue(true);
        this.orderForm.controls.paymentData.controls.blikPhoneNumber.setValue(response.blikPhoneNumber);
      }
    })
  }

  filterChanged(newFilterEvent: Event) {
    const newFilter = (newFilterEvent.target as HTMLInputElement).value
    if (newFilter == null || newFilter == "") {
      this.filteredRestaurantsList$.next(this.fullRestaurantsList)
    } else {
      this.restaurantsFilter = newFilter

      this.filteredRestaurantsList$.next(this.fullRestaurantsList.filter(x => x.name.startsWith(this.restaurantsFilter)))
    }
  }

  submitForm(e: Event) {
    e.preventDefault();

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

    this.orderControllerService.save(order).subscribe({
      next: () => this.router.navigate(["/orders/today"]),
      error: err => console.log(err)
    })

    return false;
  }

  cancelEdit() {
    // this.$store.commit("modifyOrderEntry/cancelDishEntryModification",{});
  }

}
