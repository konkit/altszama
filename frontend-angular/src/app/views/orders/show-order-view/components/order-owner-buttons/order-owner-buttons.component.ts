import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {OrderActionsService} from "../../service/order-actions.service";
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';


@Component({
    selector: 'app-order-owner-buttons',
    templateUrl: './order-owner-buttons.component.html',
    styleUrls: ['./order-owner-buttons.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatTooltipModule, MatIconModule]
})
export class OrderOwnerButtonsComponent {

  @Input() orderId!: string;

  @Input() canShowPlaceOrderButton!: boolean;
  @Input() isPlaceOrderButtonDisabled!: boolean;
  @Input() canShowMarkAsDeliveredButton!: boolean;

  constructor(private router: Router,
              private orderActionsService: OrderActionsService) {
  }

  placeOrder() {
    this.router.navigate(["/orders", this.orderId, "make_an_order"])
  }

  goToEditOrder() {
    this.router.navigate(["/orders", this.orderId, "edit"])
  }

  setAsDelivered() {
    this.orderActionsService.setAsDelivered(this.orderId)
  }
}
