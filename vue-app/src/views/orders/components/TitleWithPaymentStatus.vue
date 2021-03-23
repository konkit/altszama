<template>
  <div class="d-flex flex-wrap">
    <div>
      <h3 class="title-text">{{ title }} (<price :data-price="orderEntry.finalPrice"/>)</h3>
    </div>

    <div v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">
      <template v-if="shouldShowPaymentStatus()">
        <v-chip v-if="isUnpaid()" color="red" text-color="white" class="mx-2">
          Unpaid
        </v-chip>

        <v-chip v-if="isConfirmedAsPaid()" color="green" text-color="white" class="mx-2">
          Payment confirmed
        </v-chip>
      </template>

      <template v-if="shouldShowConfirmAsPaidButton(orderEntry)">
        <v-btn color="basic" @click="confirmAsPaid(orderEntry.id)">
          Confirm payment
          <i class="fa fa-check ml-2" aria-hidden="true"></i>
        </v-btn>
      </template>

      <template v-if="shouldShowRevertToUnpaid(orderEntry)">
        <v-btn color="basic" @click="revertToUnpaid(orderEntry.id)">
          Revert to "unpaid"
          <i class="fa fa-undo ml-2" aria-hidden="true"></i>
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import BankTransferQRCode from "@/views/orders/components/orderEntry/BankTransferQRCode.vue";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {ParticipantsOrderEntry, ShowOrderDto} from "../../../frontend-client";
import ErrorHandler from "@/lib/ErrorHandler";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;
import Price from "@/views/commons/PriceElement.vue";

@Component({
  components: {BankTransferQRCode, Price}
})
export default class TitleWithPaymentStatus extends Vue {
  @Prop() title: string;
  @Prop() priceForUser: string;
  @Prop() order!: ShowOrderDto;
  @Prop() orderEntry!: ParticipantsOrderEntry;
  @Prop() currentUserId!: string;
  @Prop() costForUser!: number;

  ordersConnector = new OrdersApiConnector()

  isOrderOwner() {
    return this.order.orderCreatorId === this.currentUserId;
  }

  isOrderEntryOwner() {
    return this.orderEntry.userId === this.currentUserId;
  }

  shouldShowPaymentStatus() {
    return (this.isOrderEntryOwner() || this.isOrderOwner()) && this.isOrderedOrDelivered()
  }

  shouldShowConfirmAsPaidButton() {
    return this.isOrderedOrDelivered()
        && this.orderEntry.paymentStatus !== ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED;
  }

  shouldShowRevertToUnpaid() {
    return this.isOrderedOrDelivered()
        && this.orderEntry.paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED;
  }

  private isOrderedOrDelivered() {
    return [OrderStateEnum.ORDERED, OrderStateEnum.DELIVERED].includes(this.order.orderState);
  }

  confirmAsPaid(orderEntryId: string) {
    this.ordersConnector
        .confirmOrderEntryAsPaid(orderEntryId)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  revertToUnpaid(orderEntryId: string) {
    this.ordersConnector
        .revertToUnpaid(orderEntryId)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  isUnpaid() {
    return this.orderEntry.paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.UNPAID
  }

  isConfirmedAsPaid() {
    return this.orderEntry.paymentStatus === ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED
  }
}
</script>

<style scoped>
.title-text {
  height: 36px;
  line-height: 36px;

  white-space: nowrap;
}
</style>
