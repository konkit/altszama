<template>
  <WithSpinner>
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
            <tr @click="goToOrder(order.id)" v-for="order in allOrdersList" :key="order.id"
                :data-href="'/orders/show/' + order.id" class="pointer">
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
  </WithSpinner>
</template>

<script>
  import WithSpinner from "../../components/commons/WithSpinner";
  import {FETCH_ALL_ORDERS} from "../../store/mutation-types"

  export default {
    mounted() {
      this.$store.dispatch(`allOrders/${FETCH_ALL_ORDERS}`)
    },
    computed: {
      allOrdersList() {
        return this.$store.state.allOrders.allOrdersList;
      },
    },
    methods: {
      goToOrder: function (selectedOrderId) {
        window.location = "#/orders/show/" + selectedOrderId
      }
    },
    components: {
      WithSpinner,
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
