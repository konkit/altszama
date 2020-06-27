<template>
  <div v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">
    <template v-if="shouldShowPaymentStatus(orderEntry)">
      <span class="status-text">
        {{paymentStatusAsText(orderEntry)}}
      </span>
    </template>

    <template v-if="shouldShowMarkAsPaidButton(orderEntry)">
      <v-btn text color="success" @click="markAsPaid(orderEntry.id)">
        Mark as paid
        <i class="fa fa-check" aria-hidden="true"></i>
      </v-btn>
    </template>

    <template v-if="shouldShowConfirmAsPaidButton(orderEntry)">
      <v-btn text color="success" @click="confirmAsPaid(orderEntry.id)">
        Confirm as paid
        <i class="fa fa-check" aria-hidden="true"></i>
      </v-btn>
    </template>

    <template v-if="shouldShowQRCodeButton(orderEntry)">
      <BankTransferQRCode :order="order" :userOrderAmount="costForUser"></BankTransferQRCode>
    </template>
  </div>
</template>

<script lang="ts">
  import {
    CONFIRM_ORDER_ENTRY_AS_PAID_ACTION,
    MARK_ORDER_ENTRY_AS_PAID_ACTION,
    NAMESPACE_SHOW_ORDER
  } from "../../../store/modules/ShowOrderModule"
  import BankTransferQRCode from "./orderEntry/BankTransferQRCode";
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop} from "vue-property-decorator";

  @Component({
    components: {BankTransferQRCode},
  })
  export default class PaymentStatus extends Vue {
    @Prop() order;
    @Prop() orderEntry;
    @Prop() currentUserId;
    @Prop() costForUser;

    isOrderOwner() {
      return this.order.orderCreatorId === this.currentUserId
    }

    isOrderEntryOwner(orderEntry) {
      return orderEntry.userId === this.currentUserId
    }

    shouldShowPaymentStatus(orderEntry) {
      return (this.isOrderEntryOwner(orderEntry) || this.isOrderOwner(this.order)) && (this.order.orderState === 'ORDERED' || this.order.orderState === 'DELIVERED')
    }

    shouldShowMarkAsPaidButton(orderEntry) {
      return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && (orderEntry.paymentStatus !== "MARKED" && orderEntry.paymentStatus !== "CONFIRMED") && this.isOrderOwner() === false)
    }

    shouldShowConfirmAsPaidButton(orderEntry) {
      return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && orderEntry.paymentStatus !== "CONFIRMED" && this.isOrderOwner() === true)
    }

    shouldShowQRCodeButton(orderEntry) {
      return this.isOrderEntryOwner(orderEntry) &&
        this.order.paymentByBankTransfer === true &&
        (this.order.orderState === 'ORDERED' || this.order.orderState === 'DELIVERED')
    }

    confirmAsPaid(orderEntryId) {
      this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${CONFIRM_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
    }

    markAsPaid(orderEntryId) {
      this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${MARK_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
    }

    paymentStatusAsText(orderEntry) {
      if (orderEntry.paymentStatus === "UNPAID") {
        return "Status: Unpaid"
      } else if (orderEntry.paymentStatus === "MARKED") {
        return "Status: Marked as paid"
      } else if (orderEntry.paymentStatus === "CONFIRMED") {
        return "Status: Payment confirmed"
      } else {
        return "Status: " + orderEntry.paymentStatus
      }
    }
  }
</script>

<style scoped>
  .status-text {
    line-height: 36px;
  }
</style>