import {Component, ErrorHandler, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {catchError, Observable, of} from "rxjs";
import {
  DishDto,
  OrderControllerService,
  OrderEntryControllerService, OrderEntrySaveRequest,
  ShowOrderResponse,
  SideDish
} from "../../../../../../../frontend-client";
import {ModifyOrderEntryState, OrderEntryData, ShowOrderViewService} from "../../../service/show-order-view.service";
import {FormBuilder} from "@angular/forms";
import * as moment from "moment";
import {Router} from "@angular/router";

interface ComboBoxHeaderItem {
  header: string;
}

interface ComboBoxItem {
  text: string;
  value: string;
  subtitle: string;
}

@Component({
  selector: 'app-create-order-entry',
  templateUrl: './create-order-entry.component.html',
  styleUrls: ['./create-order-entry.component.scss']
})
export class CreateOrderEntryComponent implements OnInit {

  @Input() orderResponse!: ShowOrderResponse
  @Input() modifyOrderEntryState!: ModifyOrderEntryState

  @Output() refreshRequest = new EventEmitter<void>();

  formGroup = this.fb.nonNullable.group({
    name: "",
    price: 0,
    additionalComments: ""
  })

  constructor(private showOrderViewService: ShowOrderViewService,
              private orderEntryControllerService: OrderEntryControllerService,
              private fb: FormBuilder,
              private router: Router) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    // this.$store.commit("clearErrors");

    const orderId = this.orderResponse.order.id;

    let dishId;
    if (this.orderResponse.allDishesInRestaurant.length > 0) {
      dishId = this.orderResponse.allDishesInRestaurant[0].id;
    } else {
      dishId = null;
    }

    this.showOrderViewService.setInitialCreateOrderEntry({orderId: orderId, dishId: dishId})
    this.showOrderViewService.setEntryLoading(false)
  }

  submitForm() {
    // Set timeout is necessary to properly handle last-minute updates in form controls
    setTimeout(() => this.saveOrderEntry(), 0)
  }

  private saveOrderEntry() {
    const state = this.modifyOrderEntryState

    const orderId = state.orderId;

    let orderEntryToSave: OrderEntrySaveRequest
    orderEntryToSave = {
      orderId: state.orderId,
      // dishEntryId: state.dishEntryId,
      dishId: "",
      additionalComments: this.formGroup.controls.additionalComments.value,
      newDish: true,
      newDishName: this.formGroup.controls.name.value,
      newDishPrice: this.formGroup.controls.price.value,
      sideDishes: [],
    };

    // if (state.orderEntryData.dishData.kind === "NewDishData") {
    //   orderEntryToSave = {
    //     orderId: state.orderId,
    //     ...this.formGroup.value,
    //     // dishEntryId: state.dishEntryId,
    //     dishId: "",
    //     additionalComments: this.formGroup.controls.additionalComments.value ?? "",
    //     newDish: true,
    //     newDishName: state.orderEntryData.dishData.newDishName,
    //     newDishPrice: state.orderEntryData.dishData.newDishPrice,
    //     sideDishes: state.orderEntryData.dishData.chosenSideDishes
    //   };
    // } else {
    //   orderEntryToSave = {
    //     orderId: state.orderId,
    //     // dishEntryId: state.dishEntryId,
    //     dishId: state.orderEntryData.dishData.dishId,
    //     additionalComments: state.orderEntryData.additionalComments,
    //     newDish: false,
    //     newDishName: "",
    //     newDishPrice: 0,
    //     sideDishes: state.orderEntryData.dishData.chosenSideDishes
    //   };
    // }

    this.orderEntryControllerService
      .save1(orderEntryToSave)
      .subscribe({
        next: () => {
          this.showOrderViewService.setEntryLoading(true)
          this.showOrderViewService.cancelDishEntryModification()
          // this.showOrderViewService.fetchOrderDataAction(orderId)
          this.refreshRequest.emit()
        },
        error: error => {
          this.formGroup.setErrors(error)
          return of("")
        }
      })
  }

  cancelEdit() {
    this.showOrderViewService.cancelDishEntryModification()
  }

  get allDishesInRestaurant(): DishDto[] {
    return this.orderResponse.allDishesInRestaurant;
  }

  get loadingEntry() {
    return this.modifyOrderEntryState.loadingEntry;
  }

  get orderEntryData(): OrderEntryData {
    return this.modifyOrderEntryState.orderEntryData;
  }

  get allDishesByCategory(): { [category: string]: DishDto[] } {
    return this.orderResponse.allDishesByCategory;
  }

  get dishIdToSideDishesMap(): { [key: string]: SideDish[] } {
    return this.dishIdToSideDishesMap;
  }

  updateOrderEntryData(newOrderEntryData: OrderEntryData) {
    this.showOrderViewService.updateOrderEntryData(newOrderEntryData)
  }

  // get allDishesAtOnce(): (ComboBoxHeaderItem | ComboBoxItem)[] {
  get allDishesAtOnce(): string[] {
    let result = Object.entries(this.orderResponse.allDishesByCategory).flatMap(([category, dishesFromCat]) => {
      const categoryHeader = {header: `Category: ${category}`}
      const dishes = dishesFromCat.map(dish => this.dishToComboBoxItem(dish));

      // return [categoryHeader, ...dishes];
      return [categoryHeader.header, ...dishes.map(x => x.text)];
    });
    console.log("allDishesAtOnce: ", result)
    return result
  }

  private dishToComboBoxItem(dish: DishDto): ComboBoxItem {
    const price = (dish.price / 100).toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN"
    });

    let updateDesc = "";
    if (dish.lastCrawled) {
      updateDesc = `auto-updated ${this.dateToRel(dish.lastCrawled)}`;
    }

    return {
      text: `${dish.name}`,
      value: dish.id,
      subtitle: `Price: ${price}, ${updateDesc}`
    };
  }

  dateToRel(date: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }
}
