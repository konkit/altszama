<template>
  <div v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">
    <template v-if="shouldShowPaymentStatus()">
      <span class="status-text">
        {{ paymentStatusAsText(orderEntry) }}
      </span>
    </template>

    <template v-if="shouldShowMarkAsPaidButton(orderEntry)">
      <v-btn text color="primary" @click="markAsPaid(orderEntry.id)">
        Mark as paid
        <i class="fa fa-check" aria-hidden="true"></i>
      </v-btn>
    </template>

    <template v-if="shouldShowConfirmAsPaidButton(orderEntry)">
      <v-btn text color="primary" @click="confirmAsPaid(orderEntry.id)">
        Confirm as paid
        <i class="fa fa-check" aria-hidden="true"></i>
      </v-btn>
    </template>

    <template v-if="shouldShowQRCodeButton(orderEntry)">
      <BankTransferQRCode
          :order="order"
          :userOrderAmount="costForUser"
      ></BankTransferQRCode>
    </template>
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

@Component({
  components: {BankTransferQRCode}
})
export default class PaymentStatus extends Vue {
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
    return (
        (this.isOrderEntryOwner() || this.isOrderOwner()) &&
        (this.order.orderState === OrderStateEnum.ORDERED ||
            this.order.orderState === OrderStateEnum.DELIVERED)
    );
  }

  shouldShowMarkAsPaidButton() {
    return (
        this.order.orderState !== OrderStateEnum.CREATED &&
        this.order.orderState !== OrderStateEnum.ORDERING &&
        this.orderEntry.paymentStatus !==
        ParticipantsOrderEntry.PaymentStatusEnum.MARKED &&
        this.orderEntry.paymentStatus !==
        ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED &&
        this.isOrderOwner() === false
    );
  }

  shouldShowConfirmAsPaidButton() {
    return (
        this.order.orderState !== OrderStateEnum.CREATED &&
        this.order.orderState !== OrderStateEnum.ORDERING &&
        this.orderEntry.paymentStatus !==
        ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED &&
        this.isOrderOwner() === true
    );
  }

  shouldShowQRCodeButton() {
    return (
        this.isOrderEntryOwner() &&
        this.order.paymentData.paymentByBankTransfer === true &&
        (this.order.orderState === OrderStateEnum.ORDERED ||
            this.order.orderState === OrderStateEnum.DELIVERED)
    );
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

  markAsPaid(orderEntryId: string) {
    this.ordersConnector
        .markOrderEntryAsPaid(orderEntryId)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  paymentStatusAsText() {
    if (
        this.orderEntry.paymentStatus ===
        ParticipantsOrderEntry.PaymentStatusEnum.UNPAID
    ) {
      return "Status: Unpaid";
    } else if (
        this.orderEntry.paymentStatus ===
        ParticipantsOrderEntry.PaymentStatusEnum.MARKED
    ) {
      return "Status: Marked as paid";
    } else if (
        this.orderEntry.paymentStatus ===
        ParticipantsOrderEntry.PaymentStatusEnum.CONFIRMED
    ) {
      return "Status: Payment confirmed";
    } else {
      return "Status: " + this.orderEntry.paymentStatus;
    }
  }
}
</script>

<style scoped>
.status-text {
  line-height: 36px;
}
</style>
