<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <h1>All orders</h1>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Date</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Order creator</th>
              </tr>
              </thead>

              <tbody>
                <tr v-on:click="goToOrder(order.id)" v-for="order in allOrdersList" v-bind:key="order.id" v-bind:data-href="'/orders/show/' + order.id" class="pointer">
                  <td>{{order.orderDate}}</td>
                  <td>{{order.restaurant.name}}</td>
                  <td>{{order.orderState}}</td>
                  <td>{{order.orderCreator.username}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '../components/commons/spinner.vue'

import ApiConnector from '../lib/ApiConnector.js'

export default {
  data () {
    return { 
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/orders/all.json")
      .then(response => {
        console.log(response.data);
        this.$store.commit('allOrders/setAllOrdersList', response.data.allOrdersList);

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  computed: {
    allOrdersList () {
      return this.$store.state.allOrders.allOrdersList;
    },
    loading () {
      return this.$store.state.loading;
    }
  },
  methods: {
    goToOrder: function(selectedOrderId) {
      window.location = "#/orders/show/" + selectedOrderId
    }
  },
  components: {
    Spinner
  }
}
</script>

<style scoped>
  .container {
    max-width: 1200px;
  }

  .row {
    margin-top: 2rem;
  }

  .pointer {
    cursor: pointer;
  }
</style>
