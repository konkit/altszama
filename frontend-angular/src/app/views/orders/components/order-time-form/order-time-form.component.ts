import {Component, Input, input} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from '@angular/material/icon';
import {NgxMatTimepickerComponent, NgxMatTimepickerDirective} from 'ngx-mat-timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
    selector: 'app-order-time-form',
    templateUrl: './order-time-form.component.html',
    styleUrls: ['./order-time-form.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, NgxMatTimepickerDirective, ReactiveFormsModule, MatIconModule, NgxMatTimepickerComponent]
})
export class OrderTimeFormComponent {
  readonly timeOfOrderControl = input.required<FormControl<string | null>>();
  @Input() timeOfDeliveryControl!: FormControl<string | null>
}
