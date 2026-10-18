import {Component, input} from '@angular/core';
import {Router} from "@angular/router";
import {OrderActionsService} from "../../service/order-actions.service";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
    selector: 'app-order-locked-warning-banner',
    templateUrl: './order-locked-warning-banner.component.html',
    styleUrls: ['./order-locked-warning-banner.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule]
})
export class OrderLockedWarningBannerComponent {

  readonly orderId = input.required<string>();

  constructor(private router: Router,
              private orderActionsService: OrderActionsService) {
  }

  placeOrder() {
    this.router.navigate(["/orders", this.orderId(), "make_an_order"])
  }

  unlockOrder() {
    this.orderActionsService.unlockOrderAndReload(this.orderId())
  }
}
