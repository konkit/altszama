<template>
  <div>
    <!-- orderCreatedButton -->
    <button v-if="this.orderState == 'ORDERED' || this.orderState == 'ORDERING'" type="button" class="btn btn-success"
            v-on:click="setAsCreated">
      <i class="fa fa-undo" aria-hidden="true"/>&nbsp;Mark back as un-ordered
    </button>

    <!-- placeOrderButton -->
    <span>
      <a v-if="this.orderState === 'CREATED' || this.orderState === 'ORDERING'"
         v-bind:href="'#/orders/' + this.orderId + '/order_view'">
        <button class="btn btn-success">
          Place order&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"/>
        </button>
      </a>

      <button v-if="this.orderState == 'DELIVERED' || this.orderState == 'REJECTED'" v-on:click="setAsOrdered"
              class="btn btn-success">
        <i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Back to ordered
      </button>
    </span>

    <!-- order-delivered-button -->
    <button v-if="this.orderState == 'ORDERED'" type="button" class="btn btn-success" v-on:click="setAsDelivered">
      Mark as delivered&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"/>
    </button>

    <!-- order-rejected-button -->
    <a class="btn btn-danger" v-on:click="setAsRejected">
      Mark as rejected&nbsp;<i class="fa fa-ban" aria-hidden="true"/>
    </a>

    <!-- edit-order-button -->
    <a v-bind:href="'#/orders/' + this.orderId + '/edit'" class="btn btn-light">
      Edit &nbsp;<i class="fa fa-pencil" aria-hidden="true"></i>
    </a>

    <!-- delete-order-button -->
    <a class="btn btn-danger" v-on:click=deleteEntry>
      Delete &nbsp;
      <i class="fa fa-times" aria-hidden="true"></i>
    </a>
  </div>
</template>

<script>
  import OrdersApiConnector from "../../lib/OrdersApiConnector";

  export default {
    name: 'order-state-buttons',
    props: ['orderId', 'orderState'],
    data() {
      return {}
    },
    methods: {
      setAsCreated: function (e) {
        OrdersApiConnector.setOrderAsCreated(this.orderId)
          .then(successResponse => window.location.reload())
          .catch(errResponse => console.log(errResponse));
      },
      setAsOrdered: function (e) {
        OrdersApiConnector.setOrderAsOrdered(this.orderId)
          .then(successResponse => window.location.reload())
          .catch(errResponse => console.log(errResponse));
      },
      setAsDelivered: function (e) {
        OrdersApiConnector.setOrderAsDelivered(this.orderId)
          .then(successResponse => window.location.reload())
          .catch(errResponse => console.log(errResponse));
      },
      setAsRejected: function (e) {
        OrdersApiConnector.setOrderAsRejected(this.orderId)
          .then(successResponse => window.location.reload())
          .catch(errResponse => console.log(errResponse));
      },
      deleteEntry: function (e) {
        OrdersApiConnector.deleteOrder(this.orderId + '/delete')
          .then(successResponse => window.location.href = '#/orders')
          .catch(errResponse => console.log(errResponse));
      },
    }
  }

</script>