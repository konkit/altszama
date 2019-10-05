<template>
  <ViewWrapper title="All orders">
    <LoadingView>
      <v-container>
        <v-row>
          <v-col cols="xs12">

            <v-card>
              <v-card-text>
                <v-data-table
                    class="table table-hover"
                    :items="allOrdersList"
                    :headers="headers"
                    :loading="false"
                    :pagination.sync="pagination">

                  <template slot="header" slot-scope="props">
                    <tr>
                      <th v-for="header in props.headers" :key="header.text">
                        {{ header.text }}
                      </th>
                    </tr>
                  </template>

                  <template slot="item" slot-scope="props">
                    <tr @click="goToOrder(props.item.id)" :key="props.item.id"
                        :data-href="'/orders/show/' + props.item.id"
                        class="pointer">
                      <td>{{props.item.orderDate}}</td>
                      <td>{{props.item.restaurantName}}</td>
                      <td>{{props.item.orderState}}</td>
                      <td>{{props.item.orderCreatorUsername}}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script>
  import LoadingView from "../commons/LoadingView";
  import {FETCH_ALL_ORDERS} from "../../store/modules/AllOrdersState";
  import router from '../../router/index'
  import ViewWrapper from "../commons/ViewWrapper";

  export default {
    data() {
      return {
        headers: [
          {text: 'Date', align: 'left', value: 'date'},
          {text: 'Restaurant', value: 'restaurant'},
          {text: 'Status', value: 'status'},
          {text: 'Order creator', value: 'orderCreator'},
        ],
        pagination: {
          rowsPerPage: 10
        },
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
      },

    },
    components: {
      ViewWrapper,
      LoadingView,
    },
  }
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }

  th {
    text-align: left;
  }
</style>
