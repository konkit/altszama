<template>
  <div class="wrapper">
    <div class="pull-right">
      <div v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">

        <div v-if="(isOrderEntryOwner(orderEntry)) && order.orderState === 'CREATED'">
          <button type="button" class="btn btn-light" @click="editEntry(orderEntry.id, dishEntry.id)">
            <i class="fa fa-pencil" aria-hidden="true"/>
          </button>

          <button type="button" class="btn btn-danger" @click="deleteEntry(orderEntry.id, dishEntry.id)">
            <i class="fa fa-times" aria-hidden="true"/>
          </button>
        </div>

        <div
            v-if="(isOrderEntryOwner(orderEntry) || isOrderOwner(order)) && (order.orderState === 'ORDERED' || order.orderState === 'DELIVERED')">
          {{paymentStatus(orderEntry)}}
        </div>

        <div v-if="shouldShowMarkAsPaidButton(orderEntry)">
          <button type="button" class="btn btn-success" @click="markAsPaid(orderEntry.id)">
            Mark as paid
          </button>
        </div>

        <div v-if="shouldShowConfirmAsPaidButton(orderEntry)">
          <button type="button" class="btn btn-success" @click="confirmAsPaid(orderEntry.id)">
            Confirm as paid
          </button>
        </div>

      </div>
    </div>

    <div>
      <p class="dish-name">
        {{dishEntry.dish.name}} (
        <price :data-price="dishEntry.price"/>
        )
      </p>
      <p v-for="sideDish in dishEntry.sideDishes" class="side-dish-name">
        + {{sideDish.name}} (
        <price :data-price="sideDish.price"/>
        )
      </p>
      <p v-if="dishEntry.comments.length > 0" class="dish-comments">Additional comments: {{dishEntry.comments}}</p>
    </div>
  </div>
</template>

<script>
  import Price from '../commons/PriceElement.vue'
  import {CONFIRM_ORDER_ENTRY_AS_PAID_ACTION, MARK_ORDER_ENTRY_AS_PAID_ACTION} from "../../store/modules/ShowOrderState";

  export default {
    name: 'order-entry-row',
    props: ['order', 'orderEntry', 'dishEntry', 'currentUserId'],
    methods: {
      isOrderOwner: function () {
        return this.order.orderCreator.id == this.currentUserId
      },
      isOrderEntryOwner: function (orderEntry) {
        return orderEntry.user.id === this.currentUserId
      },
      shouldShowMarkAsPaidButton: function (orderEntry) {
        return (this.order.orderState != 'CREATED' && this.order.orderState != 'ORDERING' && (orderEntry.paymentStatus != "MARKED" && orderEntry.paymentStatus != "CONFIRMED") && this.isOrderOwner() == false)
      },
      shouldShowConfirmAsPaidButton: function (orderEntry) {
        return (this.order.orderState != 'CREATED' && this.order.orderState != 'ORDERING' && orderEntry.paymentStatus != "CONFIRMED" && this.isOrderOwner() == true)
      },
      paymentStatus: function (orderEntry) {
        if (orderEntry.paymentStatus == "UNPAID") {
          return "Unpaid"
        } else if (orderEntry.paymentStatus == "MARKED") {
          return "Marked as paid"
        } else if (orderEntry.paymentStatus == "CONFIRMED") {
          return "Payment confirmed"
        } else {
          return orderEntry.paymentStatus
        }
      },
      confirmAsPaid: function (orderEntryId) {
        this.$store.dispatch(`showOrder/${CONFIRM_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      markAsPaid: function (orderEntryId) {
        this.$store.dispatch(`showOrder/${MARK_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      deleteEntry: function (orderEntryId, dishEntryId) {
        this.$emit("deleteEntry", orderEntryId, dishEntryId);
      },
      editEntry: function (orderEntryId, dishEntryId) {
        this.$store.commit('setEntryEditing', {"orderEntryId": orderEntryId, "dishEntryId": dishEntryId})
      },
    },
    components: {
      Price
    }
  }
</script>

<style scoped>
  p.dish-name {
    margin-top: 0;
    margin-bottom: 0;
  }

  p.side-dish-name {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 10pt;
    color: #555555;
  }

  p.dish-comments {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 10pt;
    color: #444444;
  }

  .wrapper {
    min-height: 50px;
    margin-bottom: 20px;
  }
</style>
