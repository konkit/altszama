import {Component, Input} from '@angular/core';
import {ParticipantsDishEntry, ParticipantsOrderEntry, ShowOrderDto} from "../../../../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  selector: 'app-show-order-entry',
  templateUrl: './show-order-entry.component.html',
  styleUrls: ['./show-order-entry.component.scss']
})
export class ShowOrderEntryComponent {
  @Input() index!: number;
  @Input() order!: ShowOrderDto
  @Input() orderEntry!: ParticipantsOrderEntry;
  @Input() dishEntry!: ParticipantsDishEntry;
  @Input() currentUserId!: string;

  canEditOrderEntry() {
    return this.isOrderOwner() || (this.isOrderEntryOwner() && this.order.orderState === OrderStateEnum.CREATED)
  }

  isOrderOwner() {
    return this.order.orderCreatorId === this.currentUserId;
  }

  isOrderEntryOwner() {
    return this.orderEntry.userId === this.currentUserId;
  }

  editDishEntry() {
    // this.$store.commit(
    //   `modifyOrderEntry/setDishEntryEditing`,
    //   {
    //     orderEntryId: this.orderEntry.id,
    //     dishEntryId: this.dishEntry.id
    //   }
    // );
  }

  deleteDishEntry() {
    // this.ordersConnector
    //   .deleteDishEntry(this.orderEntry.id, this.dishEntry.id)
    //   .then(() => {
    //     this.$store.commit("setLoadingTrue");
    //     this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
    //   })
    //   .catch(errResponse => ErrorHandler.handleError(errResponse));
  }
}
