import {Component, Input, OnInit} from '@angular/core';
import {
  DishDto,
  ParticipantsDishEntry,
  ParticipantsOrderEntry,
  ShowOrderResponse,
  SideDish
} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {of} from "rxjs";
import {OrderEntryFormType, SideDishForm} from "../order-entry-form/order-entry-form.component";


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

  formGroup: FormGroup<OrderEntryFormType> = this.fb.nonNullable.group({
    dish: this.fb.nonNullable.control<DishDto | string>(''),
    price: this.fb.nonNullable.control<number>(0),
    additionalComments: this.fb.nonNullable.control<string>(''),
    chosenSideDishes: this.fb.nonNullable.array<FormGroup<SideDishForm>>([])
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
      additionalComments: this.dishEntry.comments,
      chosenSideDishes: [],
    })

    let sideDishControls = this.dishEntry.sideDishes
      .map(sd => this.fb.nonNullable.group({
        sideDish: this.fb.nonNullable.control<string | SideDish>(sd.name),
        price: this.fb.nonNullable.control(sd.price)
      }));
    this.formGroup.controls.chosenSideDishes = this.fb.nonNullable.array(sideDishControls)
  }

  private updateOrderEntry() {
    //TODO(konkit): Refactor
    //TODO(konkit): Add sidedishes

    if (typeof this.formGroup.controls.dish.value === "object") {
      let sideDishes = this.asSideDishArray(this.formGroup.controls.chosenSideDishes);
      let params = {
        orderId: this.orderResponse.order.id,
        orderEntryId: this.orderEntry.id,
        dishEntryId: this.dishEntry.id,
        additionalComments: this.formGroup.controls.additionalComments.value,
        dishId: this.formGroup.controls.dish.value.id,
        sideDishes: sideDishes,
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
      let sideDishes = this.asSideDishArray(this.formGroup.controls.chosenSideDishes);
      let params = {
        orderId: this.orderResponse.order.id,
        orderEntryId: this.orderEntry.id,
        dishEntryId: this.dishEntry.id,
        dishName: this.formGroup.controls.dish.value,
        dishPrice: this.formGroup.controls.price.value,
        additionalComments: this.formGroup.controls.additionalComments.value,
        sideDishes: sideDishes,
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

  //TODO: deduplicate
  private asSideDishArray(formArray: FormArray<FormGroup<SideDishForm>>) {
    return formArray.value.map(formValue => {
      if (typeof formValue.sideDish === "object") {
        if (formValue.sideDish.price === formValue.price) {
          return {
            id: formValue.sideDish.id,
            isNew: false,
            newSideDishName: "",
            newSideDishPrice: 0
          }
        } else {
          return {
            id: "",
            isNew: true,
            newSideDishName: formValue.sideDish.name,
            newSideDishPrice: formValue.price
          }
        }
      } else {
        return {
          id: "",
          isNew: true,
          newSideDishName: formValue.sideDish,
          newSideDishPrice: formValue.price
        }
      }
    });
  }

  onSubmit() {
    this.updateOrderEntry()
  }

  onCancel() {
    this.showOrderViewService.cancelDishEntryModification()
  }
}
