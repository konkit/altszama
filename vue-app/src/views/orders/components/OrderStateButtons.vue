<template>
  <div>
    <v-btn
        color="primary"
        v-if="this.orderState === 'ORDERED' || this.orderState === 'ORDERING'"
        @click="setAsCreated"
    >
      <i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Mark back as un-ordered
    </v-btn>

    <v-btn
        color="primary"
        v-if="this.orderState === 'DELIVERED' || this.orderState === 'REJECTED'"
        @click="setAsOrdered"
    >
      <i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Back to ordered
    </v-btn>

    <v-btn color="error" @click="setAsRejected()">
      Mark as rejected&nbsp;<i class="fa fa-ban" aria-hidden="true"></i>
    </v-btn>

    <v-btn color="error" @click="deleteDishEntry()">
      Delete &nbsp;<i class="fa fa-times" aria-hidden="true"></i>
    </v-btn>
  </div>
</template>

<script lang="ts">
import router from "../../../router";
import Component from "vue-class-component";
import Vue from "vue";
import ErrorHandler from "@/lib/ErrorHandler";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";

@Component({})
export default class OrderStateButtons extends Vue {
  longVersion = true;

  ordersConnector = new OrdersApiConnector()

  get orderId() {
    return this.$store.state.showOrder.order.id;
  }

  get orderState() {
    return this.$store.state.showOrder.order.orderState;
  }

  setAsCreated() {
    this.ordersConnector
        .setOrderAsCreated(this.orderId)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  setAsOrdered() {
    this.ordersConnector
        .setOrderAsOrdered(this.orderId)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  setAsDelivered() {
    this.ordersConnector
        .setOrderAsDelivered(this.orderId)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  setAsRejected() {
    this.ordersConnector
        .setOrderAsRejected(this.orderId)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  deleteDishEntry() {
    this.ordersConnector
        .deleteOrder(this.orderId)
        .then(() => this.$router.push({name: "TodayOrders"}))
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  placeOrder() {
    router.push({name: "OrderView", params: {id: this.orderId}});
  }

  edit() {
    router.push({name: "OrderEditForm", params: {id: this.orderId}});
  }
}
</script>
