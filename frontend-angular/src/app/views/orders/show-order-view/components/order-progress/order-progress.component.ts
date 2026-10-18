import {Component, computed, input} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {ShowOrderDto} from "../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-order-progress',
  templateUrl: './order-progress.component.html',
  styleUrls: ['./order-progress.component.scss'],
  standalone: true,
  imports: [MatIconModule]
})
export class OrderProgressComponent {
  readonly orderState = input.required<OrderStateEnum>();

  readonly steps = [
    {state: OrderStateEnum.Created, label: "Open"},
    {state: OrderStateEnum.Ordering, label: "Ordering"},
    {state: OrderStateEnum.Ordered, label: "Ordered"},
    {state: OrderStateEnum.Delivered, label: "Delivered"},
  ]

  readonly currentIndex = computed(() => this.steps.findIndex(s => s.state === this.orderState()))

  isDone(index: number) {
    return index < this.currentIndex() || this.orderState() === OrderStateEnum.Delivered
  }

  isCurrent(index: number) {
    return index === this.currentIndex() && !this.isDone(index)
  }
}
