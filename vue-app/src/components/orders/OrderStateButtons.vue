<template>
  <div>
  <div v-if="longVersion">
    <!-- orderCreatedButton -->
    <button v-if="this.orderState === 'ORDERED' || this.orderState === 'ORDERING'" type="button" class="btn btn-success" @click="setAsCreated">
      <i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Mark back as un-ordered
    </button>

    <!-- placeOrderButton -->
    <span>
      <a v-if="this.orderState === 'CREATED' || this.orderState === 'ORDERING'"
         :href="'#/orders/' + this.orderId + '/order_view'">
        <button class="btn btn-success">
          Place order&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
        </button>
      </a>

      <button v-if="this.orderState === 'DELIVERED' || this.orderState === 'REJECTED'" @click="setAsOrdered"
              class="btn btn-success">
        <i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Back to ordered
      </button>
    </span>

    <!-- order-delivered-button -->
    <button v-if="this.orderState === 'ORDERED'" type="button" class="btn btn-success" @click="setAsDelivered">
      Mark as delivered&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
    </button>

    <!-- order-rejected-button -->
    <a class="btn btn-danger" @click="setAsRejected">
      Mark as rejected&nbsp;<i class="fa fa-ban" aria-hidden="true"></i>
    </a>

    <!-- edit-order-button -->
    <a :href="'#/orders/' + this.orderId + '/edit'" class="btn btn-light">
      Edit &nbsp;<i class="fa fa-pencil" aria-hidden="true"></i>
    </a>

    <!-- delete-order-button -->
    <a class="btn btn-danger" @click=deleteDishEntry()>
      Delete &nbsp;
      <i class="fa fa-times" aria-hidden="true"></i>
    </a>
  </div>

  <div v-if="!longVersion">
    <!-- orderCreatedButton -->
    <button v-if="this.orderState === 'ORDERED' || this.orderState === 'ORDERING'" type="button" class="btn btn-success"
            @click="setAsCreated" title="Mark back as un-ordered">
      <i class="fa fa-undo" aria-hidden="true"></i>
    </button>

    <!-- placeOrderButton -->
    <span>
      <a v-if="this.orderState === 'CREATED' || this.orderState === 'ORDERING'" :href="'#/orders/' + this.orderId + '/order_view'">
        <button class="btn btn-success" title="Place order">
          <i class="fa fa-arrow-right" aria-hidden="true"></i>
        </button>
      </a>

      <button v-if="this.orderState === 'DELIVERED' || this.orderState === 'REJECTED'" @click="setAsOrdered"
              class="btn btn-success" title="Back to ordered">
        <i class="fa fa-undo" aria-hidden="true"></i>
      </button>
    </span>

    <!-- order-delivered-button -->
    <button v-if="this.orderState === 'ORDERED'" type="button" class="btn btn-success" @click="setAsDelivered" title="Mark as delivered">
      <i class="fa fa-arrow-right" aria-hidden="true"></i>
    </button>

    <!-- order-rejected-button -->
    <a class="btn btn-danger" @click="setAsRejected" title="Mark as rejected">
      <i class="fa fa-ban" aria-hidden="true"></i>
    </a>

    <!-- edit-order-button -->
    <a :href="'#/orders/' + this.orderId + '/edit'" class="btn btn-light" title="Edit">
      <i class="fa fa-pencil" aria-hidden="true"></i>
    </a>

    <!-- delete-order-button -->
    <a class="btn btn-danger" @click=deleteDishEntry() title="Delete">
      <i class="fa fa-times" aria-hidden="true"></i>
    </a>
  </div>
  </div>
</template>

<script>
  import {
    SET_ORDER_AS_CREATED_ACTION,
    SET_ORDER_AS_ORDERED_ACTION,
    SET_ORDER_AS_DELIVERED_ACTION,
    SET_ORDER_AS_REJECTED_ACTION,
    DELETE_ORDER_ACTION
  } from "../../store/modules/ShowOrderState";

  export default {
    name: 'order-state-buttons',
    data() {
      return {
          longVersion: false,
      }
    },
    computed: {
      orderId () {
        return this.$store.state.showOrder.order.id;
      },
      orderState () {
        return this.$store.state.showOrder.order.orderState;
      }
    },
    methods: {
      setAsCreated () {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_CREATED_ACTION}`, { orderId: this.orderId });
      },
      setAsOrdered () {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_ORDERED_ACTION}`, { orderId: this.orderId });
      },
      setAsDelivered () {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_DELIVERED_ACTION}`, { orderId: this.orderId });
      },
      setAsRejected () {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_REJECTED_ACTION}`, { orderId: this.orderId });
      },
      deleteDishEntry () {
        return this.$store.dispatch(`showOrder/${DELETE_ORDER_ACTION}`, { orderId: this.orderId });
      },
    }
  }

</script>