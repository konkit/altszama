import {Component, Input} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {MatFormFieldControl} from "@angular/material/form-field";

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent {
  @Input() timeFormControl!: FormControl
}
