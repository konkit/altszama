<template>
  <LoadingView>
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
  </LoadingView>
</template>

<script>
  import LoadingView from "../../components/commons/LoadingView";
  import {FETCH_ALL_ORDERS} from "../../store/modules/AllOrdersState";

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
      goToOrder (selectedOrderId) {
        window.location = "#/orders/show/" + selectedOrderId
      }
    },
    components: {
      LoadingView,
    }
  }
</script>

<style scoped>
  .row {
    margin-top: 2rem;
  }

  .pointer {
    cursor: pointer;
  }
</style>
