<template>
  <div>
    <!-- orderCreatedButton -->
    <button v-if="this.orderState == 'ORDERED' || this.orderState == 'ORDERING'" type="button" class="btn btn-success"
            @click="setAsCreated">
      <i class="fa fa-undo" aria-hidden="true"/>&nbsp;Mark back as un-ordered
    </button>

    <!-- placeOrderButton -->
    <span>
      <a v-if="this.orderState === 'CREATED' || this.orderState === 'ORDERING'"
         :href="'#/orders/' + this.orderId + '/order_view'">
        <button class="btn btn-success">
          Place order&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"/>
        </button>
      </a>

      <button v-if="this.orderState == 'DELIVERED' || this.orderState == 'REJECTED'" @click="setAsOrdered"
              class="btn btn-success">
        <i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Back to ordered
      </button>
    </span>

    <!-- order-delivered-button -->
    <button v-if="this.orderState == 'ORDERED'" type="button" class="btn btn-success" @click="setAsDelivered">
      Mark as delivered&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"/>
    </button>

    <!-- order-rejected-button -->
    <a class="btn btn-danger" @click="setAsRejected">
      Mark as rejected&nbsp;<i class="fa fa-ban" aria-hidden="true"/>
    </a>

    <!-- edit-order-button -->
    <a :href="'#/orders/' + this.orderId + '/edit'" class="btn btn-light">
      Edit &nbsp;<i class="fa fa-pencil" aria-hidden="true"></i>
    </a>

    <!-- delete-order-button -->
    <a class="btn btn-danger" @click=deleteEntry>
      Delete &nbsp;
      <i class="fa fa-times" aria-hidden="true"></i>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'order-state-buttons',
    props: ['orderId', 'orderState'],
    data() {
      return {}
    },
    methods: {
      setAsCreated: function (e) {
        this.$store.dispatch("showOrder/setOrderAsCreated", {orderId: this.orderId});
      },
      setAsOrdered: function (e) {
        this.$store.dispatch("showOrder/setOrderAsOrdered", {orderId: this.orderId});
      },
      setAsDelivered: function (e) {
        this.$store.dispatch("showOrder/setOrderAsDelivered", {orderId: this.orderId});
      },
      setAsRejected: function (e) {
        this.$store.dispatch("showOrder/setOrderAsRejected", {orderId: this.orderId});
      },
      deleteEntry: function (e) {
        this.$store.dispatch("showOrder/deleteOrder", {orderId: this.orderId});
      },
    }
  }

</script>