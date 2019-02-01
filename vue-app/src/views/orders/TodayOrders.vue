<template>
  <LoadingView>
    <v-toolbar>
      <v-toolbar-title>
        Today orders
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <simple-card>
        <h2>Your orders today:</h2>

        <div v-if="this.currentOrderEntries.length > 0">
          <template v-for="orderEntry in this.currentOrderEntries">
            <template v-for="dishEntry in orderEntry.dishEntries">
              <p class="pointer" @click="goToOrder(orderEntry.orderId)" :key="dishEntry.id">
                <b>{{dishEntry.dish.name}}</b>
                from
                <b>{{dishEntry.restaurantName}}</b>
                (STATUS: {{orderEntry.orderState}})
              </p>
            </template>
          </template>
        </div>
        <div v-else>
          <div>
            <p>... nothing yet.</p>
          </div>
        </div>
      </simple-card>

      <simple-card>
        <errors-component/>

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
              <td>{{order.restaurantName}}</td>
              <td>{{order.orderCreatorUsername}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-else>
          <p>No orders.</p>
        </div>

      </simple-card>

      <simple-card>

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
              <td>{{order.restaurantName}}</td>
              <td>{{order.orderCreatorUsername}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-else>
          <p>No orders.</p>
        </div>

      </simple-card>

      <simple-card>

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
              <td>{{order.restaurantName}}</td>
              <td>{{order.orderCreatorUsername}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-else>
          <p>No orders.</p>
        </div>

      </simple-card>

      <simple-card>

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
              <td>{{order.restaurantName}}</td>
              <td>{{order.orderCreatorUsername}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div v-else>
          <p>No orders.</p>
        </div>
      </simple-card>

      <v-btn fixed dark fab bottom right color="green" @click="goToCreateOrder()">
        <v-icon>add</v-icon>
      </v-btn>
    </v-content>

  </LoadingView>
</template>

<script>
    import ApiConnector from '../../lib/ApiConnector.js'
    import LoadingView from "../../components/commons/LoadingView";
    import {FETCH_TODAY_ORDERS_ACTION} from "../../store/modules/TodayOrdersState"
    import {mapState} from "vuex"
    import ErrorsComponent from '../../components/commons/Errors'
    import SimpleCard from "../../components/commons/SimpleCard";


    export default {
        mounted() {
            ApiConnector.initializePushNotifications();

            let errorsComponent = this.$refs.errorsComponent;

            this.$store.dispatch(`todayOrders/${FETCH_TODAY_ORDERS_ACTION}`, {errorsComponent: errorsComponent});
        },
        methods: {
            goToOrder(selectedOrderId) {
                location = "#/orders/show/" + selectedOrderId
            },
            goToCreateOrder() {
                location = "#/orders/create"
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
            SimpleCard,
            LoadingView,
            ErrorsComponent,
            SimpleCard
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