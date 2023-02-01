import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, map, Observable, take} from "rxjs";
import {
  CreateOrderInitialData,
  OrderControllerService,
  OrderSaveRequest,
  RestaurantDto
} from "../../../../frontend-client";

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

  stepperState: number = 1

  // Order
  restaurantId = "";
  orderDate = "";
  timeOfOrder = "";

  priceModifiers: PriceModifierFieldsValue = {
    decreaseInPercent: 0,
    deliveryCostPerEverybody: 0,
    deliveryCostPerDish: 0
  }

  paymentData: PaymentDataFieldsValue = {
    paymentByCash: true,
    paymentByBankTransfer: false,
    bankTransferNumber: "",
    paymentByBlik: false,
    blikPhoneNumber: ""
  }

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

      this.restaurantId = restaurantId;
      this.orderDate = response.orderDate;
      this.timeOfOrder = response.timeOfOrder;

      this.priceModifiers = {
        decreaseInPercent: 0,
        deliveryCostPerEverybody: 0,
        deliveryCostPerDish: 0
      }

      this.paymentData = {
        paymentByCash: true,
        paymentByBankTransfer: false,
        bankTransferNumber: "",
        paymentByBlik: false,
        blikPhoneNumber: ""
      }

      if (response.bankTransferNumber) {
        this.paymentData.paymentByBankTransfer = true;
        this.paymentData.bankTransferNumber = response.bankTransferNumber;
      }

      if (response.blikPhoneNumber) {
        this.paymentData.paymentByBlik = true;
        this.paymentData.blikPhoneNumber = response.blikPhoneNumber;
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


  updateRestaurantId(newValue: string) {
    this.restaurantId = newValue;
  }

  updateTimeOfOrder(newValue: string) {
    this.timeOfOrder = newValue;
  }

  submitForm(e: Event) {
    e.preventDefault();



    const order: OrderSaveRequest = {
      restaurantId: this.restaurantId,
      orderDate: this.orderDate,
      timeOfOrder: this.timeOfOrder,
      deliveryData: this.priceModifiers,
      paymentData: this.paymentData
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

  next() {
    if (this.stepperState == 1) {
      this.stepperState = 2
    }
  }

  back() {
    if (this.stepperState > 1) {
      this.stepperState -= 1
    } else {
      this.router.navigate(["/orders/today"])
    }
  }

  selectRestaurantId(id: string) {
    this.restaurantId = id
  }
}
