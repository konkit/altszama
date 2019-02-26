<template>
  <div>
  <div class="wrapper">
    <div class="dish-name">
      <div class="dish-name-text">{{dishEntry.dishName }}</div>
      <div class="dish-price"> ( <price :data-price="dishEntry.price"/> )</div>

      <span class="edit-buttons" v-if="(isOrderEntryOwner(orderEntry)) && order.orderState === 'CREATED'">
        <v-btn flat icon @click="editDishEntry()">
          <i class="fa fa-pencil" aria-hidden="true"></i>
        </v-btn>

        <v-btn flat icon @click="deleteDishEntry()">
          <i class="fa fa-times" aria-hidden="true"></i>
        </v-btn>
      </span>
    </div>
  </div>

  <div class="side-dishes">
    <p v-for="sideDish in dishEntry.sideDishes" class="side-dish-name py-2">
      + {{sideDish.name}} ( <price :data-price="sideDish.price"/> )
    </p>

    <p v-if="dishEntry.comments.length > 0" class="dish-comments py-2">
      Additional comments: {{dishEntry.comments}}
    </p>
  </div>
  </div>
</template>

<script>
  import Price from '../../commons/PriceElement.vue'
  import {
    CONFIRM_ORDER_ENTRY_AS_PAID_ACTION,
    MARK_ORDER_ENTRY_AS_PAID_ACTION,
    DELETE_DISH_ENTRY_ACTION,
    NAMESPACE_SHOW_ORDER
  } from "../../../store/modules/ShowOrderState";
  import {NAMESPACE_MODIFY_ORDER_ENTRY, SET_DISH_ENTRY_EDITING} from "../../../store/modules/ModifyOrderEntryState";
  import {mapState} from "vuex";

  export default {
    name: 'order-entry',
    props: ['orderEntry', 'dishEntry', 'currentUserId'],
    methods: {
      isOrderOwner() {
        return this.order.orderCreatorId === this.currentUserId
      },
      isOrderEntryOwner(orderEntry) {
        return orderEntry.userId === this.currentUserId
      },
      shouldShowMarkAsPaidButton(orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && (orderEntry.paymentStatus !== "MARKED" && orderEntry.paymentStatus !== "CONFIRMED") && this.isOrderOwner() === false)
      },
      shouldShowConfirmAsPaidButton(orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && orderEntry.paymentStatus !== "CONFIRMED" && this.isOrderOwner() === true)
      },
      paymentStatus(orderEntry) {
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
      confirmAsPaid(orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${CONFIRM_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      markAsPaid(orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${MARK_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      editDishEntry() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_EDITING}`, {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        })
      },
      deleteDishEntry() {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${DELETE_DISH_ENTRY_ACTION}`, {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        });
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
  .wrapper {
    display: flex;
    flex-direction: row;
  }

  .dish-name {
    display: flex;
    flex-direction: row;
    min-width: 0;
  }

  .dish-name-text {
    display: block;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dish-price {
    white-space: nowrap;
    padding-left: 5px;
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

  .edit-buttons {
    width: 104px;
    min-width: 104px;
    margin-top: -15px;
  }

  .side-dishes {
    padding-left: 10px;
   }
</style>
