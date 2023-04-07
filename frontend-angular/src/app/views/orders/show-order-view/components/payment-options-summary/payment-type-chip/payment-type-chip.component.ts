import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-payment-type-chip',
  templateUrl: './payment-type-chip.component.html',
  styleUrls: ['./payment-type-chip.component.scss']
})
export class PaymentTypeChipComponent {
  @Input() allowed!: boolean
}
