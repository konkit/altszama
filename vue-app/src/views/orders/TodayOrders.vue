<template>
  <ViewWrapper>
    <LoadingView>
      <v-container>
        <v-row>
          <v-col cols="xs12">
            <h1 class="mb-4">Your orders today:</h1>

            <div v-if="this.currentOrderEntries.length > 0">
              <v-list>
                <template v-for="(orderEntry, i) in currentOrderEntries">
                  <template v-for="(dishEntry, j) in orderEntry.dishEntries">
                    <v-list-item @click="goToOrder(orderEntry.orderId)" :key="'dish-entry-' + i + '-' + j">
                      <v-list-item-content>
                        <v-list-item-title class="pointer">
                          <b>{{ dishEntry.dish.name }}</b>
                          from
                          <b>{{ dishEntry.restaurantName }}</b>
                          (STATUS: {{ orderEntry.orderState }})
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </template>
              </v-list>
            </div>

            <div v-else>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>You haven't ordered anything today yet.</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>

            <v-divider class="my-5"></v-divider>

            <h1>Orders:</h1>

            <errors-component/>

            <v-list>
              <template v-if="this.ordersList.length > 0">
                <v-list-item @click="goToOrder(order.id)" v-for="(order, i) in this.ordersList" :key="'order-' + i">
                  <v-list-item-content>
                    <v-list-item-title class="pointer">
                      <div class="wide-order-status" v-if="$vuetify.breakpoint.mdAndUp">
                        <div class="order-data-wrapper">
                          <b>{{ order.restaurantName }}</b> (created by
                          {{ order.orderCreatorUsername }})
                        </div>

                        <div class="order-state-wrapper">
                          <div class="orderState" :class="{matchingState: order.orderState === 'CREATED'}">
                            CREATED
                          </div>

                          <div class="orderState" :class="{matchingState: order.orderState === 'ORDERING'}">
                            ORDERING RIGHT NOW
                          </div>

                          <div class="orderState" :class="{matchingState: order.orderState === 'ORDERED'}">
                            ORDERED
                          </div>

                          <div class="orderState" :class="{matchingState:order.orderState === 'DELIVERED'}">
                            DELIVERED
                          </div>
                        </div>
                      </div>

                      <div class="thin-order-status" v-if="$vuetify.breakpoint.smAndDown">
                        <div>
                          <b>{{ order.restaurantName }}</b> (created by {{ order.orderCreatorUsername }})
                        </div>
                        <div>Status: {{ order.orderState }}</div>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <template v-if="this.ordersList.length === 0">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>No orders yet</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>

            <v-btn dark large bottom right color="primary" @click="goToCreateOrder()">
              Add new order<v-icon>add</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import ErrorHandler from "@/lib/ErrorHandler";
import LoadingView from "@/views/commons/LoadingView.vue";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import router from "@/router/index";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";
import {OrderEntryDto, TodayOrderDto} from "../../frontend-client";
import NotificationsApiConnector from "@/lib/api/NotificationsApiConnector";

@Component({
  components: {
    ViewWrapper,
    LoadingView,
    ErrorsComponent,
  }
})
export default class TodayOrders extends Vue {
  currentOrderEntries: OrderEntryDto[] = [];
  ordersList: TodayOrderDto[] = [];

  connector: OrdersApiConnector = new OrdersApiConnector();
  notificationsConnector: NotificationsApiConnector = new NotificationsApiConnector();

  mounted() {
    this.notificationsConnector.initializePushNotifications();

    this.connector
        .fetchTodaysOrders()
        .then(todayOrdersData => {
          this.currentOrderEntries = todayOrdersData.currentOrderEntries;
          this.ordersList = todayOrdersData.ordersList;

          this.$store.commit("setTitle", "Today orders")
          this.$store.commit("setLoadingFalse");
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  goToOrder(selectedOrderId: string) {
    router.push({name: "ShowOrder", params: {id: selectedOrderId}});
  }

  goToCreateOrder() {
    router.push({name: "OrderCreateForm"});
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.orderState {
  color: #b2b2b2;
}

.matchingState {
  color: rgba(0, 0, 0, 0.87);
  font-weight: 900;
}

.wide-order-status {
  display: flex;
  flex-direction: row;
}

.order-data-wrapper {
  padding-right: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.order-state-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin-left: auto;
  min-width: 28rem;
  max-width: 28rem;
}
</style>
