<template>
  <div class="wrapper">
    <div class="pull-right">
      <div v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">

        <div v-if="(isOrderEntryOwner(orderEntry)) && order.orderState === 'CREATED'">
          <button type="button" class="btn btn-light" @click="editEntry()">
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </button>

          <button type="button" class="btn btn-danger" @click="deleteEntry()">
            <i class="fa fa-times" aria-hidden="true"></i>
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
  import {
    CONFIRM_ORDER_ENTRY_AS_PAID_ACTION,
    MARK_ORDER_ENTRY_AS_PAID_ACTION,
    DELETE_DISH_ENTRY_ACTION,
    NAMESPACE_SHOW_ORDER
  } from "../../store/modules/ShowOrderState";
  import {NAMESPACE_MODIFY_ORDER_ENTRY, SET_ENTRY_EDITING} from "../../store/modules/ModifyOrderEntryState";
  import {mapState} from "vuex";

  export default {
    name: 'order-entry',
    props: ['orderEntry', 'dishEntry', 'currentUserId'],
    methods: {
      isOrderOwner () {
        return this.order.orderCreator.id === this.currentUserId
      },
      isOrderEntryOwner (orderEntry) {
        return orderEntry.user.id === this.currentUserId
      },
      shouldShowMarkAsPaidButton (orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && (orderEntry.paymentStatus !== "MARKED" && orderEntry.paymentStatus !== "CONFIRMED") && this.isOrderOwner() === false)
      },
      shouldShowConfirmAsPaidButton (orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && orderEntry.paymentStatus !== "CONFIRMED" && this.isOrderOwner() === true)
      },
      paymentStatus (orderEntry) {
        if (orderEntry.paymentStatus === "UNPAID") {
          return "Unpaid"
        } else if (orderEntry.paymentStatus === "MARKED") {
          return "Marked as paid"
        } else if (orderEntry.paymentStatus === "CONFIRMED") {
          return "Payment confirmed"
        } else {
          return orderEntry.paymentStatus
        }
      },
      confirmAsPaid (orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${CONFIRM_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      markAsPaid (orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${MARK_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      deleteEntry () {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${DELETE_DISH_ENTRY_ACTION}`, {orderId: this.order.id, orderEntryId: this.orderEntry.id, dishEntryId: this.dishEntry.id});
      },
      editEntry () {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_EDITING}`, {"orderEntryId": this.orderEntry.id, "dishEntryId": this.dishEntry.id})
      },
    },
    computed: {
      ...mapState(NAMESPACE_SHOW_ORDER, [
        "order"
      ])
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
