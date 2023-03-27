import {Component, Input, OnInit} from '@angular/core';
import {
  ParticipantsDishEntry,
  ParticipantsOrderEntry,
  ShowOrderResponse
} from "../../../../../../../../frontend-client";
import {ModifyOrderEntryState, ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormBuilder} from "@angular/forms";
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

  formGroup = this.fb.nonNullable.group({
    name: "",
    price: 0,
    additionalComments: ""
  })

  constructor(private fb: FormBuilder,
              private showOrderViewService: ShowOrderViewService) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.showOrderViewService.setEntryLoading(false)

    this.formGroup.setValue({
      name: this.dishEntry.dishName,
      price: this.dishEntry.price,
      additionalComments: this.dishEntry.comments
    })
  }

  submitForm() {
    // Set timeout is necessary to properly handle last-minute updates in form controls
    setTimeout(() => this.updateOrderEntry(), 0)
  }

  updateOrderEntry() {
    //TODO(konkit): Reuse autocomplete from create
    let params = {
      orderId: this.orderResponse.order.id,
      orderEntryId: this.orderEntry.id,
      dishEntryId: this.dishEntry.id,
      formValue: {
        additionalComments: this.formGroup.controls.additionalComments.value,
        name: this.formGroup.controls.name.value,
        price: this.formGroup.controls.price.value,
      },
    };

    this.showOrderViewService.updateOrderEntry(params)
      .subscribe({
        next: () => {},
        error: error => {
          this.formGroup.setErrors(error)
          return of("")
        }
      })
  }

  cancelEdit() {
    this.showOrderViewService.cancelDishEntryModification()
  }
}
