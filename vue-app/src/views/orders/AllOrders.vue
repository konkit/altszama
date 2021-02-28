<template>
  <ViewWrapper>
    <LoadingView>
      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-data-table class="table table-hover" :items="allOrdersList" :headers="headers" :loading="false">
              <template slot="header" slot-scope="props">
                <tr>
                  <th v-for="header in props.headers" :key="header.text">
                    {{ header.text }}
                  </th>
                </tr>
              </template>

              <template slot="item" slot-scope="props">
                <tr @click="goToOrder(props.item.id)"
                    :key="props.item.id"
                    class="pointer"
                >
                  <td>{{ props.item.orderDate }}</td>
                  <td>{{ props.item.restaurantName }}</td>
                  <td>{{ props.item.orderState }}</td>
                  <td>{{ props.item.orderCreatorUsername }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import LoadingView from "@/views/commons/LoadingView.vue";
import router from "@/router/index";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import ApiConnector from "@/lib/ApiConnector";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";
import {AllOrdersOrderDto} from "@/frontend-client";
import Navigation from "@/views/commons/Navigation.vue";

@Component({
  components: {
    Navigation,
    ViewWrapper,
    LoadingView
  }
})
export default class AllOrders extends Vue {
  allOrdersList: AllOrdersOrderDto[] = [];

  headers = [
    {text: "Date", align: "left", value: "date"},
    {text: "Restaurant", value: "restaurant"},
    {text: "Status", value: "status"},
    {text: "Order creator", value: "orderCreator"}
  ];

  connector: OrdersApiConnector = new OrdersApiConnector();

  mounted() {
    this.connector
        .fetchAllOrders()
        .then(allOrdersList => {
          this.allOrdersList = allOrdersList.allOrdersList;

          this.$store.commit("setTitle", "All orders")
          this.$store.commit("setLoadingFalse");
        })
        .catch(errResponse => ApiConnector.handleError(errResponse));
  }

  goToOrder(selectedOrderId: string) {
    router.push({name: "ShowOrder", params: {id: selectedOrderId}});
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
