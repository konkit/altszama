<template>
  <LoadingView>
    <v-toolbar>
      <v-toolbar-title>
        All orders
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
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
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

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
