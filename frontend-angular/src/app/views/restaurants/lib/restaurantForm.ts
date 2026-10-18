import {FormControl, FormGroup, NonNullableFormBuilder, Validators} from "@angular/forms";

export interface RestaurantForm {
  name: FormControl<string>
  address: FormControl<string>
  url: FormControl<string>
  telephone: FormControl<string>
}

// Empty is allowed; otherwise it has to look like a web address
const urlValidator = Validators.pattern(/^\s*(https?:\/\/\S+)?\s*$/i)

export function createRestaurantForm(fb: NonNullableFormBuilder): FormGroup<RestaurantForm> {
  return fb.group({
    name: fb.control("", Validators.required),
    address: fb.control(""),
    url: fb.control("", urlValidator),
    telephone: fb.control(""),
  })
}
