import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {DishDto, SideDish, SideDishData} from "../../../../../../../frontend-client";

export interface OrderEntryFormType {
  dish: FormControl<DishDto | string>
  price: FormControl<number>
  additionalComments: FormControl<string>
  chosenSideDishes: FormArray<FormGroup<SideDishForm>>
}

export interface InitialOrderEntryFormValue {
  dish: DishDto | string
  price: number
  additionalComments: string,
  chosenSideDishes: SideDish[]
}

export interface SideDishForm {
  sideDish: FormControl<string | SideDish>
  price: FormControl<number>
}

export interface SideDishValue {
  sideDish: string | SideDish
  price: number
}


export type OrderEntryFormValue = NewOrderEntryFormValue | ExistingOrderEntryFormValue
export interface NewOrderEntryFormValue {
  kind: "New"
  dishName: string
  price: number
  additionalComments: string,
  chosenSideDishes: SideDishData[]
}

export interface ExistingOrderEntryFormValue {
  kind: "Existing"
  dish: DishDto
  additionalComments: string,
  chosenSideDishes: SideDishData[]
}
