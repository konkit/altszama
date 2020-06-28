<template>
  <ViewWrapper title="Today's orders">
    <LoadingView>
      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-card>
              <v-card-title>
                Your orders today:
              </v-card-title>

              <v-card-text>

                <div v-if="this.currentOrderEntries.length > 0">
                  <v-list>
                    <template v-for="(orderEntry, i) in currentOrderEntries">
                      <template v-for="(dishEntry, j) in orderEntry.dishEntries">

                        <v-list-item @click="goToOrder(orderEntry.orderId)" :key="i*j">
                          <v-list-item-content :key="dishEntry.id">
                            <v-list-item-title class="pointer">
                              <b>{{dishEntry.dish.name}}</b>
                              from
                              <b>{{dishEntry.restaurantName}}</b>
                              (STATUS: {{orderEntry.orderState}})
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>

                      </template>
                    </template>
                  </v-list>
                </div>

                <div v-else>
                  <div>
                    <span>You haven't ordered anything today yet.</span>
                  </div>
                </div>

              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>


      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-card>
              <v-card-title>
                Orders:
              </v-card-title>

              <v-card-text>
                <errors-component/>

                <v-list>
                  <template v-if="this.ordersList.length > 0">
                    <v-list-item @click="goToOrder(order.id)" v-for="(order, i) in this.ordersList" :key="i">
                      <v-list-item-content>
                        <v-list-item-title class="pointer">
                          <div class="wide-order-status" v-if="$vuetify.breakpoint.mdAndUp">
                            <div class="order-data-wrapper">
                              <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                            </div>

                            <div class="order-state-wrapper">
                              <div class="orderState" :class="{ matchingState: order.orderState === 'CREATED' }">
                                CREATED
                              </div>

                              <div class="orderState" :class="{ matchingState: order.orderState === 'ORDERING' }">
                                ORDERING RIGHT NOW
                              </div>

                              <div class="orderState" :class="{ matchingState: order.orderState === 'ORDERED' }">
                                ORDERED
                              </div>

                              <div class="orderState" :class="{ matchingState: order.orderState === 'DELIVERED' }">
                                DELIVERED
                              </div>
                            </div>
                          </div>

                          <div class="thin-order-status" v-if="$vuetify.breakpoint.smAndDown">
                            <div>
                              <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                            </div>
                            <div>
                              Status: {{order.orderState}}
                            </div>
                          </div>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <template v-if="this.ordersList.length === 0">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>No orders</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>


      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn fixed dark fab large bottom right color="green" @click="goToCreateOrder()" v-on="on">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <span>Create new order</span>
      </v-tooltip>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
  import ApiConnector from '../../lib/ApiConnector'
  import LoadingView from "../commons/LoadingView";
  import ErrorsComponent from '../commons/ErrorsComponent'
  import router from '../../router/index'
  import ViewWrapper from "../commons/ViewWrapper";
  import Vue from "vue";
  import Component from "vue-class-component";
  import OrdersApiConnector from "../../lib/OrdersApiConnector";
  import {OrderDto, OrderEntryDto} from "../../frontend-client";
  import {RootState} from "../../store";

  @Component({
    components: {
      ViewWrapper,
      LoadingView,
      ErrorsComponent,
    }
  })
  export default class TodayOrders extends Vue {
    currentOrderEntries: OrderEntryDto[] = [];
    ordersList: OrderDto[] = [];

    connector: OrdersApiConnector;

    mounted() {
      ApiConnector.initializePushNotifications();

      this.connector = new OrdersApiConnector(this.$store.state as RootState);

      this.connector.fetchTodaysOrders()
        .then(todayOrdersData => {
          this.currentOrderEntries = todayOrdersData.currentOrderEntries;
          this.ordersList = todayOrdersData.ordersList;

          this.$store.commit('setLoadingFalse');
          document.title = `Today orders | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }

    goToOrder(selectedOrderId: string) {
      router.push("/orders/show/" + selectedOrderId)
    }

    goToCreateOrder() {
      router.push("/orders/create")
    }

  }
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }

  .orderState {
    color: #B2B2B2;
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