<template>
  <LoadingView>
    <div class="jumbotron lunch-bg-img">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <h2>So today you ordered ...</h2>

            <div v-if="this.currentOrderEntries.length > 0">
              <template v-for="orderEntry in this.currentOrderEntries">
                <template v-for="dishEntry in orderEntry.dishEntries">
                  <p class="pointer" @click="goToOrder(orderEntry.order.id)" :key="dishEntry.id">
                    <b>{{dishEntry.dish.name}}</b>
                    from
                    <b>{{dishEntry.dish.restaurant.name}}</b>
                    (STATUS: {{orderEntry.order.orderState}})
                  </p>
                </template>
              </template>
            </div>
            <div v-else>
              <div>
                <p>... nothing yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col">

          <a href="#/orders/create" class="btn btn-success pull-right">Create new order &nbsp;<i class="fa fa-plus"
                                                                                                 aria-hidden="true"></i></a>

          <h1>Orders today:</h1>

        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <h3>Not ordered yet ({{ this.createdOrders.length }})</h3>

          <div v-if="this.createdOrders.length > 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Restaurant</th>
                <th>Who will order?</th>
              </tr>
              </thead>

              <tbody>
              <tr @click="goToOrder(order.id)" v-for="order in this.createdOrders" :key="order.id"
                  class="pointer">
                <td>{{order.restaurant.name}}</td>
                <td>{{order.orderCreator.username}}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else>
            <p>No orders.</p>
          </div>

        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <h3>Ordering right now ({{ this.orderingOrders.length }})</h3>

          <div v-if="this.orderingOrders.length > 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Restaurant</th>
                <th>Who will order?</th>
              </tr>
              </thead>

              <tbody>
              <tr @click="goToOrder(order.id)" v-for="order in this.orderingOrders" :key="order.id"
                  class="pointer">
                <td>{{order.restaurant.name}}</td>
                <td>{{order.orderCreator.username}}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else>
            <p>No orders.</p>
          </div>

        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <h3>Ordered ({{ this.orderedOrders.length }})</h3>

          <div v-if="this.orderedOrders.length > 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Restaurant</th>
                <th>Who will order?</th>
              </tr>
              </thead>

              <tbody>
              <tr @click="goToOrder(order.id)" v-for="order in this.orderedOrders" :key="order.id"
                  class="pointer">
                <td>{{order.restaurant.name}}</td>
                <td>{{order.orderCreator.username}}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else>
            <p>No orders.</p>
          </div>

        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <h3>Delivered ({{ this.deliveredOrders.length }})</h3>

          <div v-if="this.deliveredOrders.length > 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Restaurant</th>
                <th>Who will order?</th>
              </tr>
              </thead>

              <tbody>
              <tr @click="goToOrder(order.id)" v-for="order in this.deliveredOrders" :key="order.id"
                  class="pointer">
                <td>{{order.restaurant.name}}</td>
                <td>{{order.orderCreator.username}}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else>
            <p>No orders.</p>
          </div>

        </div>
      </div>
    </div>
  </LoadingView>
</template>

<script>
  import ApiConnector from '../../lib/ApiConnector.js'
  import LoadingView from "../../components/commons/LoadingView";
  import {FETCH_TODAY_ORDERS_ACTION} from "../../store/modules/TodayOrdersState"
  import {mapState} from "vuex"

  export default {
    data() {
      return {
      }
    },
    mounted() {
      ApiConnector.initializePushNotifications();

      let errorsComponent = this.$refs.errorsComponent;

      this.$store.dispatch(`todayOrders/${FETCH_TODAY_ORDERS_ACTION}`, {errorsComponent: errorsComponent});
    },
    methods: {
      goToOrder (selectedOrderId) {
        location = "#/orders/show/" + selectedOrderId
      }
    },
    computed: {
      ...mapState("todayOrders", [
        "currentOrderEntries",
        "createdOrders",
        "orderingOrders",
        "orderedOrders",
        "deliveredOrders"
      ])
    },
    components: {
      LoadingView,
    }
  }
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }

  .row {
    margin-top: 2rem;
  }

  .lunch-bg-img {
    background-image: url('../../assets/lunch-bw.png');
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: 0% 72%;
    /* min-height: 300px; */
  }
</style>