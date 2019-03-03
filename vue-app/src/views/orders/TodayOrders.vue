<template>
  <ViewWrapper title="Today's orders">
    <LoadingView>
      <simple-card>
        <div v-if="this.currentOrderEntries.length > 0">
          <v-list>
            <v-subheader>Your orders today:</v-subheader>

            <template v-for="orderEntry in currentOrderEntries">
              <template v-for="dishEntry in orderEntry.dishEntries">

                <v-list-tile @click="goToOrder(orderEntry.orderId)">
                  <v-list-tile-content :key="dishEntry.id">
                    <v-list-tile-title class="pointer">
                      <b>{{dishEntry.dish.name}}</b>
                      from
                      <b>{{dishEntry.restaurantName}}</b>
                      (STATUS: {{orderEntry.orderState}})
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

              </template>
            </template>
          </v-list>
        </div>
        <div v-else>
          <div>
            <p>You haven't ordered anything today yet.</p>
          </div>
        </div>
      </simple-card>

      <simple-card>
        <errors-component/>

        <v-list>
          <v-subheader>Not ordered yet ({{ this.createdOrders.length }})</v-subheader>

          <div v-if="this.createdOrders.length > 0">
            <v-list-tile @click="goToOrder(order.id)" v-for="order in this.createdOrders">
              <v-list-tile-content>
                <v-list-tile-title class="pointer">
                  <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>

          <div v-else>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>No orders</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>

          <v-divider :inset="false"></v-divider>

          <v-subheader>Ordering right now ({{ this.orderingOrders.length }})</v-subheader>

          <div v-if="this.orderingOrders.length > 0">
            <v-list-tile @click="goToOrder(order.id)" v-for="order in this.orderingOrders">
              <v-list-tile-content>
                <v-list-tile-title class="pointer">
                  <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>

          <div v-else>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>No orders</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>

          <v-divider :inset="false"></v-divider>

          <v-subheader>Ordered ({{ this.orderedOrders.length }})</v-subheader>

          <div v-if="this.orderedOrders.length > 0">
            <v-list-tile @click="goToOrder(order.id)" v-for="order in this.orderedOrders">
              <v-list-tile-content>
                <v-list-tile-title class="pointer">
                  <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>

          <div v-else>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>No orders</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>

          <v-divider :inset="false"></v-divider>

          <v-subheader>Delivered ({{ this.deliveredOrders.length }})</v-subheader>

          <div v-if="this.deliveredOrders.length > 0">
            <v-list-tile @click="goToOrder(order.id)" v-for="order in this.deliveredOrders" :key="order.id">
              <v-list-tile-content>
                <v-list-tile-title class="pointer">
                  <b>{{order.restaurantName}}</b> (created by {{order.orderCreatorUsername}})
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>

          <div v-else>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>No orders</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>
        </v-list>

      </simple-card>

      <v-btn fixed dark fab large bottom right color="green" @click="goToCreateOrder()">
        <v-icon>add</v-icon>
      </v-btn>
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

  .row {
    margin-top: 2rem;
  }

  .lunch-bg-img {
    background-image: url('../../assets/lunch-bw.png');
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: 0% 72%;
    /* min-height: 300px; */
  }
</style>