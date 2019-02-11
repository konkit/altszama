<template>
  <LoadingView>
    <v-toolbar>
      <v-toolbar-title>
        All orders
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <simple-card>
        <v-data-table class="table table-hover" :items="allOrdersList" :headers="headers" :loading="false">
          <template slot="headers" slot-scope="props">
            <tr>
              <th v-for="header in props.headers" :key="header.text">
                {{ header.text }}
              </th>
            </tr>
          </template>

          <template slot="items" slot-scope="props">
            <tr @click="goToOrder(props.item.id)" :key="props.item.id" :data-href="'/orders/show/' + props.item.id"
                class="pointer">
              <td>{{props.item.orderDate}}</td>
              <td>{{props.item.restaurantName}}</td>
              <td>{{props.item.orderState}}</td>
              <td>{{props.item.orderCreatorUsername}}</td>
            </tr>
          </template>
        </v-data-table>
      </simple-card>
    </v-content>
  </LoadingView>
</template>

<script>
    import LoadingView from "../../components/commons/LoadingView";
    import {FETCH_ALL_ORDERS} from "../../store/modules/AllOrdersState";
    import SimpleCard from "../../components/commons/SimpleCard";
    import router from '../../router/index'

    export default {
        data() {
            return {
                headers: [
                    { text: 'Date', align: 'left', value: 'date' },
                    { text: 'Restaurant', value: 'restaurant' },
                    { text: 'Status', value: 'status' },
                    { text: 'Order creator', value: 'orderCreator' },
                ],
            }
        },
        mounted() {
            this.$store.dispatch(`allOrders/${FETCH_ALL_ORDERS}`)
        },
        computed: {
            allOrdersList() {
                return this.$store.state.allOrders.allOrdersList;
            },
        },
        methods: {
            goToOrder(selectedOrderId) {
                router.push("/orders/show/" + selectedOrderId)
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
