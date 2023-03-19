import {Component, Input, OnInit} from '@angular/core';
import {of} from "rxjs";
import {OrderEntryControllerService, ShowOrderResponse} from "../../../../../../../../frontend-client";
import {ShowOrderViewService} from "../../../../service/show-order-view.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-create-order-entry',
  templateUrl: './create-order-entry.component.html',
  styleUrls: ['./create-order-entry.component.scss']
})
export class CreateOrderEntryComponent implements OnInit {

  @Input() orderResponse!: ShowOrderResponse

  formGroup = this.fb.nonNullable.group({
    name: "",
    price: 0,
    additionalComments: ""
  })

  constructor(private showOrderViewService: ShowOrderViewService,
              private orderEntryControllerService: OrderEntryControllerService,
              private fb: FormBuilder) {
    this.showOrderViewService.setEntryLoading(true)
  }

  ngOnInit() {
    this.showOrderViewService.setEntryLoading(false)
  }

  submitForm() {
    // Set timeout is necessary to properly handle last-minute updates in form controls
    setTimeout(() => this.saveOrderEntry(), 0)
  }

  private saveOrderEntry() {
    // TODO(konkit): add autosuggest
    // TODO(konkit): add detecting already selected dish, thus deduplicating

    let params = {
      orderId: this.orderResponse.order.id,
      formValue: {
        name: this.formGroup.controls.name.value,
        price: this.formGroup.controls.price.value,
        additionalComments: this.formGroup.controls.additionalComments.value
      }
    };

    this.showOrderViewService.saveOrderEntry(params)
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
