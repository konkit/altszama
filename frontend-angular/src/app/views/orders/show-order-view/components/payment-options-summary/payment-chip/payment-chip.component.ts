import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-payment-chip',
  templateUrl: './payment-chip.component.html',
  styleUrls: ['./payment-chip.component.scss']
})
export class PaymentChipComponent {
  @Input() allowed!: boolean
}
