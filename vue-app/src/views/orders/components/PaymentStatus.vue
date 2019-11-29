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

<script>
  import {
    DELETE_DISH_ENTRY_ACTION,
    UNLOCK_ORDER_ACTION,
    FETCH_ORDER_DATA_ACTION,
    NAMESPACE_SHOW_ORDER,
    SET_ORDER_AS_CREATED_ACTION,
    SET_ORDER_AS_ORDERED_ACTION,
    SET_ORDER_AS_DELIVERED_ACTION,
    SET_ORDER_AS_REJECTED_ACTION,
    DELETE_ORDER_ACTION,
    CONFIRM_ORDER_ENTRY_AS_PAID_ACTION,
    MARK_ORDER_ENTRY_AS_PAID_ACTION
  } from "../../../store/modules/ShowOrderState"
  import {
    SET_DISH_ENTRY_CREATING,
    SET_DISH_ENTRY_EDITING,
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY,
  } from "../../../store/modules/ModifyOrderEntryState";
  import BankTransferQRCode from "./orderEntry/BankTransferQRCode";

  export default {
    components: {BankTransferQRCode},
    props: ["order", "orderEntry", "currentUserId", "costForUser"],
    name: "PaymentStatus",
    methods: {
      isOrderOwner() {
        return this.order.orderCreatorId === this.currentUserId
      },
      isOrderEntryOwner(orderEntry) {
        return orderEntry.userId === this.currentUserId
      },
      shouldShowPaymentStatus(orderEntry) {
        return (this.isOrderEntryOwner(orderEntry) || this.isOrderOwner(this.order)) && (this.order.orderState === 'ORDERED' || this.order.orderState === 'DELIVERED')
      },
      shouldShowMarkAsPaidButton(orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && (orderEntry.paymentStatus !== "MARKED" && orderEntry.paymentStatus !== "CONFIRMED") && this.isOrderOwner() === false)
      },
      shouldShowConfirmAsPaidButton(orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && orderEntry.paymentStatus !== "CONFIRMED" && this.isOrderOwner() === true)
      },
      shouldShowQRCodeButton(orderEntry) {
        return this.isOrderEntryOwner(orderEntry) &&
          (this.order.orderState === 'ORDERED' || this.order.orderState === 'DELIVERED')
      },
      confirmAsPaid(orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${CONFIRM_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      markAsPaid(orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${MARK_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
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
      },
    }
  }
</script>

<style scoped>
  .status-text {
    line-height: 36px;
  }
</style>