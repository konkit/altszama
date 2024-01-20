import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-payment-status-chip',
    templateUrl: './payment-status-chip.component.html',
    styleUrls: ['./payment-status-chip.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class PaymentStatusChipComponent {
  @Input() isPaid!: boolean
}
