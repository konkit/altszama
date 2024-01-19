import {OrderEntryDto} from "../../../../frontend-client";
import OrderStateEnum = OrderEntryDto.OrderStateEnum;

export function orderStateToCaption(orderState: OrderStateEnum): string {
  switch (orderState) {
    case "CREATED":
      return "OPEN"
    case "ORDERING":
      return "ORDERING NOW"
    case "ORDERED":
      return "WAITING FOR DELIVERY"
    case "DELIVERED":
      return "DELIVERED"
    case "REJECTED":
      return "REJECTED"
  }
}
