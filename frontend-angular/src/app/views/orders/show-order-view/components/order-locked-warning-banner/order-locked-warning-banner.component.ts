import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {OrderActionsService} from "../../service/order-actions.service";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-order-locked-warning-banner',
    templateUrl: './order-locked-warning-banner.component.html',
    styleUrls: ['./order-locked-warning-banner.component.scss'],
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatIconModule]
})
export class OrderLockedWarningBannerComponent {

  @Input() orderId!: string;

  constructor(private router: Router,
              private orderActionsService: OrderActionsService) {
  }

  placeOrder() {
    this.router.navigate(["/orders", this.orderId, "make_an_order"])
  }

  unlockOrder() {
    this.orderActionsService.unlockOrderAndReload(this.orderId)
  }
}
