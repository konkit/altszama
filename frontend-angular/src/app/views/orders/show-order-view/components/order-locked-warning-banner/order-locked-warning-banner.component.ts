import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {OrderActionsService} from "../../service/order-actions.service";

@Component({
  selector: 'app-order-locked-warning-banner',
  templateUrl: './order-locked-warning-banner.component.html',
  styleUrls: ['./order-locked-warning-banner.component.scss']
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
