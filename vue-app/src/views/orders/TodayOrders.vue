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
                    <template v-for="orderEntry in currentOrderEntries">
                      <template v-for="dishEntry in orderEntry.dishEntries">

                        <v-list-item @click="goToOrder(orderEntry.orderId)">
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
                  <v-subheader>Not ordered yet ({{ this.createdOrders.length }})</v-subheader>

                  <div v-if="this.createdOrders.length > 0">
                    <v-list-item @click="goToOrder(order.id)" v-for="order in this.createdOrders">
                      <v-list-item-content>
                        <v-list-item-title class="pointer">
                          <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>

                  <div v-else>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>No orders</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>

                  <v-divider :inset="false"></v-divider>

                  <v-subheader>Ordering right now ({{ this.orderingOrders.length }})</v-subheader>

                  <div v-if="this.orderingOrders.length > 0">
                    <v-list-item @click="goToOrder(order.id)" v-for="order in this.orderingOrders">
                      <v-list-item-content>
                        <v-list-item-title class="pointer">
                          <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>

                  <div v-else>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>No orders</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>

                  <v-divider :inset="false"></v-divider>

                  <v-subheader>Ordered ({{ this.orderedOrders.length }})</v-subheader>

                  <div v-if="this.orderedOrders.length > 0">
                    <v-list-item @click="goToOrder(order.id)" v-for="order in this.orderedOrders">
                      <v-list-item-content>
                        <v-list-item-title class="pointer">
                          <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>

                  <div v-else>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>No orders</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>

                  <v-divider :inset="false"></v-divider>

                  <v-subheader>Delivered ({{ this.deliveredOrders.length }})</v-subheader>

                  <div v-if="this.deliveredOrders.length > 0">
                    <v-list-item @click="goToOrder(order.id)" v-for="order in this.deliveredOrders" :key="order.id">
                      <v-list-item-content>
                        <v-list-item-title class="pointer">
                          <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>

                  <div v-else>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>No orders</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
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

<script>
  import ApiConnector from '../../lib/ApiConnector.js'
  import LoadingView from "../commons/LoadingView";
  import {FETCH_TODAY_ORDERS_ACTION} from "../../store/modules/TodayOrdersState"
  import {mapState} from "vuex"
  import ErrorsComponent from '../commons/Errors'
  import SimpleCard from "../commons/SimpleCard";
  import router from '../../router/index'
  import ViewWrapper from "../commons/ViewWrapper";


  export default {
    mounted() {
      ApiConnector.initializePushNotifications();

      let errorsComponent = this.$refs.errorsComponent;

      this.$store.dispatch(`todayOrders/${FETCH_TODAY_ORDERS_ACTION}`, {errorsComponent: errorsComponent});
    },
    methods: {
      goToOrder(selectedOrderId) {
        router.push("/orders/show/" + selectedOrderId)
      },
      goToCreateOrder() {
        router.push("/orders/create")
      }
    },
    computed: {
      ...mapState("todayOrders", [
        "currentOrderEntries",
        "createdOrders",
        "orderingOrders",
        "orderedOrders",
        "deliveredOrders"
      ])
    },
    components: {
      ViewWrapper,
      SimpleCard,
      LoadingView,
      ErrorsComponent,
      SimpleCard
    }
  }
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>