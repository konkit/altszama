import {Component, input} from '@angular/core';


@Component({
    selector: 'app-payment-status-chip',
    templateUrl: './payment-status-chip.component.html',
    styleUrls: ['./payment-status-chip.component.scss'],
    standalone: true,
    imports: []
})
export class PaymentStatusChipComponent {
  readonly isPaid = input.required<boolean>();
}
