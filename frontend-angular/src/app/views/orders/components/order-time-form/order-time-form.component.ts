import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-order-time-form',
  templateUrl: './order-time-form.component.html',
  styleUrls: ['./order-time-form.component.scss']
})
export class OrderTimeFormComponent {
  @Input() timeOfOrderControl!: FormControl<string | null>
  @Input() timeOfDeliveryControl!: FormControl<string | null>
}
