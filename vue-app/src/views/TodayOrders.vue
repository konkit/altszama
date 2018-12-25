<template>
  <WithSpinner>
    <div class="jumbotron lunch-bg-img">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <h2>So today you ordered ...</h2>

            <div v-if="this.results.currentOrderEntries.length > 0">
              <template v-for="orderEntry in this.results.currentOrderEntries">
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
          <h3>Not ordered yet ({{ this.results.createdOrders.length }})</h3>

          <div v-if="this.results.createdOrders.length > 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Restaurant</th>
                <th>Who will order?</th>
              </tr>
              </thead>

              <tbody>
              <tr v-on:click="goToOrder(order.id)" v-for="order in this.results.createdOrders" v-bind:key="order.id"
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
          <h3>Ordering right now ({{ this.results.orderingOrders.length }})</h3>

          <div v-if="this.results.orderingOrders.length > 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Restaurant</th>
                <th>Who will order?</th>
              </tr>
              </thead>

              <tbody>
              <tr v-on:click="goToOrder(order.id)" v-for="order in this.results.orderingOrders" v-bind:key="order.id"
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
          <h3>Ordered ({{ this.results.orderedOrders.length }})</h3>

          <div v-if="this.results.orderedOrders.length > 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Restaurant</th>
                <th>Who will order?</th>
              </tr>
              </thead>

              <tbody>
              <tr @click="goToOrder(order.id)" v-for="order in this.results.orderedOrders" v-bind:key="order.id"
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
          <h3>Delivered ({{ this.results.deliveredOrders.length }})</h3>

          <div v-if="this.results.deliveredOrders.length > 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Restaurant</th>
                <th>Who will order?</th>
              </tr>
              </thead>

              <tbody>
              <tr v-on:click="goToOrder(order.id)" v-for="order in this.results.deliveredOrders" v-bind:key="order.id"
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
  </WithSpinner>
</template>

<script>
  import ApiConnector from '../lib/ApiConnector.js'
  import WithSpinner from "../components/commons/WithSpinner";
  import DishesApiConnector from "../lib/DishesApiConnector";

  export default {
    data() {
      return {
        results: {
          currentOrderEntries: [],
          createdOrders: [],
          orderingOrders: [],
          orderedOrders: [],
          deliveredOrders: []
        }
      }
    },
    created() {
      this.$store.commit('setLoadingTrue')
    },
    mounted() {
      ApiConnector.initializePushNotifications();

      DishesApiConnector.fetchTodaysOrders()
        .then(todayOrdersData => {
          this.results = todayOrdersData;

          this.$store.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    methods: {
      goToOrder: function (selectedOrderId) {
        location = "#/orders/show/" + selectedOrderId
      }
    },
    components: {
      WithSpinner,
    }
  }
</script>

<style scoped>
  .container {
    max-width: 900px;
  }

  .pointer {
    cursor: pointer;
  }

  .row {
    margin-top: 2rem;
  }

  .lunch-bg-img {
    background-image: url('../assets/lunch-bw.png');
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: 0% 72%;
    /* min-height: 300px; */
  }
</style>