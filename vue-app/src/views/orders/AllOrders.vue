<template>
  <LoadingView>
    <v-toolbar>
      <v-toolbar-title>
        All orders
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <simple-card>
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
            <td>{{order.restaurantName}}</td>
            <td>{{order.orderState}}</td>
            <td>{{order.orderCreatorUsername}}</td>
          </tr>
          </tbody>
        </table>
      </simple-card>
    </v-content>
  </LoadingView>
</template>

<script>
  import LoadingView from "../../components/commons/LoadingView";
  import {FETCH_ALL_ORDERS} from "../../store/modules/AllOrdersState";
  import SimpleCard from "../../components/commons/SimpleCard";

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
      SimpleCard,
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
