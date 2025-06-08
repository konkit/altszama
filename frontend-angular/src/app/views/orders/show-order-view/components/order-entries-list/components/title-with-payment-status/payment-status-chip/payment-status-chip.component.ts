import { Component, input } from '@angular/core';
import { ChipComponent } from '../../../../../../../../components/chip/chip.component';


@Component({
    selector: 'app-payment-status-chip',
    templateUrl: './payment-status-chip.component.html',
    styleUrls: ['./payment-status-chip.component.scss'],
    standalone: true,
  imports: [
    ChipComponent
  ]
})
export class PaymentStatusChipComponent {
  readonly isPaid = input.required<boolean>();
}
