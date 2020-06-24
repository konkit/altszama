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

<script lang="ts">
  import LoadingView from "../commons/LoadingView";
  import router from '../../router/index'
  import ViewWrapper from "../commons/ViewWrapper";
  import Vue from "vue";
  import Component from "vue-class-component";
  import ApiConnector from "../../lib/ApiConnector";
  import OrdersApiConnector from "../../lib/OrdersApiConnector";

  @Component({
    components: {
      ViewWrapper,
      LoadingView,
    },
  })
  export default class AllOrders extends Vue {
    allOrdersList = [];

    headers = [
      { text: 'Date', align: 'left', value: 'date' },
      { text: 'Restaurant', value: 'restaurant' },
      { text: 'Status', value: 'status' },
      { text: 'Order creator', value: 'orderCreator' },
      ];

    pagination = {
      rowsPerPage: 10
    };

    mounted() {
      OrdersApiConnector.fetchAllOrders()
        .then(allOrdersList => {
          this.allOrdersList = allOrdersList;
          this.$store.commit('setLoadingFalse');

          document.title = `All orders | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }

    goToOrder(selectedOrderId) {
      router.push("/orders/show/" + selectedOrderId)
    }
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
