import {OrderEntryDto} from "../../../../frontend-client";
import {ChipTone} from "../../../components/chip/chip.component";
import OrderStateEnum = OrderEntryDto.OrderStateEnum;

export function orderStateToCaption(orderState: OrderStateEnum): string {
  switch (orderState) {
    case "CREATED":
      return "Open"
    case "ORDERING":
      return "Ordering now"
    case "ORDERED":
      return "Waiting for delivery"
    case "DELIVERED":
      return "Delivered"
    case "REJECTED":
      return "Rejected"
  }
}

export function orderStateToTone(orderState: OrderStateEnum): ChipTone {
  switch (orderState) {
    case "CREATED":
      return "primary"
    case "ORDERING":
      return "warning"
    case "ORDERED":
      return "primary"
    case "DELIVERED":
      return "success"
    case "REJECTED":
      return "error"
  }
}
