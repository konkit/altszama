<template>
  <div>
    <v-btn color="success" v-if="this.orderState === 'ORDERED' || this.orderState === 'ORDERING'" @click="setAsCreated">
      <i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Mark back as un-ordered
    </v-btn>

    <v-btn color="success" v-if="this.orderState === 'DELIVERED' || this.orderState === 'REJECTED'" @click="setAsOrdered">
      <i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Back to ordered
    </v-btn>

    <v-btn color="error" @click="setAsRejected">
      Mark as rejected&nbsp;<i class="fa fa-ban" aria-hidden="true"></i>
    </v-btn>

    <v-btn color="error" @click=deleteDishEntry()>
      Delete &nbsp;<i class="fa fa-times" aria-hidden="true"></i>
    </v-btn>
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
  import router from '../../router/index'

  export default {
    name: 'order-state-buttons',
    data() {
      return {
          longVersion: true,
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
      placeOrder () {
        router.push("/orders/" + this.orderId + '/order_view')
      },
      edit() {
        router.push("/orders/" + this.orderId + '/edit')
      }
    }
  }

</script>