import {Component, Input, OnInit} from '@angular/core';
import {
  DishDto,
  ParticipantsDishEntry,
  ParticipantsOrderEntry,
  ShowOrderResponse
} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {of} from "rxjs";

@Component({
  selector: 'app-edit-order-entry',
  templateUrl: './edit-order-entry.component.html',
  styleUrls: ['./edit-order-entry.component.scss']
})
export class EditOrderEntryComponent implements OnInit {

  @Input() orderResponse!: ShowOrderResponse
  @Input() modifyOrderEntryState!: ModifyOrderEntryState
  @Input() orderEntry!: ParticipantsOrderEntry
  @Input() dishEntry!: ParticipantsDishEntry

  formGroup: FormGroup<{additionalComments: FormControl<string>, dish: FormControl<DishDto | string>, price: FormControl<number>}> = this.fb.nonNullable.group({
    dish: this.fb.nonNullable.control<DishDto | string>(''),
    price: this.fb.nonNullable.control<number>(0),
    additionalComments: this.fb.nonNullable.control<string>(''),
  });

  constructor(private fb: FormBuilder,
              private showOrderViewService: ShowOrderViewService) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.showOrderViewService.setEntryLoading(false)

    this.formGroup.setValue({
      dish: this.orderResponse.allDishesInRestaurant.find(x => x.id == this.dishEntry.dishId) || "",
      price: this.dishEntry.price,
      additionalComments: this.dishEntry.comments
    })
  }

  private updateOrderEntry() {
    //TODO(konkit): Refactor
    //TODO(konkit): Add sidedishes

    if (typeof this.formGroup.controls.dish.value === "object") {
      let params = {
        orderId: this.orderResponse.order.id,
        orderEntryId: this.orderEntry.id,
        dishEntryId: this.dishEntry.id,
        additionalComments: this.formGroup.controls.additionalComments.value,
        dishId: this.formGroup.controls.dish.value.id
      }

      this.showOrderViewService.updateOrderEntryWithExistingDish(params)
        .subscribe({
          next: () => {},
          error: error => {
            this.formGroup.setErrors(error)
            return of("")
          }
        })
    } else {
      let params = {
        orderId: this.orderResponse.order.id,
        orderEntryId: this.orderEntry.id,
        dishEntryId: this.dishEntry.id,
        dishName: this.formGroup.controls.dish.value,
        dishPrice: this.formGroup.controls.price.value,
        additionalComments: this.formGroup.controls.additionalComments.value,
      };

      this.showOrderViewService.updateOrderEntryWithNewDish(params)
        .subscribe({
          next: () => {},
          error: error => {
            this.formGroup.setErrors(error)
            return of("")
          }
        })
    }
  }

  onSubmit() {
    this.updateOrderEntry()
  }

  onCancel() {
    this.showOrderViewService.cancelDishEntryModification()
  }
}
