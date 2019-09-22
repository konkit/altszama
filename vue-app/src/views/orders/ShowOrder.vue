<template>
  <ViewWrapper :title="title()" backpath="#/orders/">

    <template slot="toolbar-buttons">
      <template v-if="!loading && isOrderOwner()">
        <v-btn @click="edit">
          <i class="fa fa-cog" aria-hidden="true"></i>
        </v-btn>
      </template>
    </template>

    <LoadingView>
      <v-container v-if="this.isOrdering() && this.isOrderOwner()">
        <v-row>
          <v-col cols="xs12">
            <OrderLockedWarning :order-id="this.orderId">
            </OrderLockedWarning>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col>
                    <div class="py-2 px-4">
                      <b>See menu at &nbsp;</b> <a target="_blank" :href="order.restaurantUrl">{{order.restaurantUrl}}</a>
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <OrderDataSummary :order="order"></OrderDataSummary>
                  </v-col>

                  <v-col>
                    <price-summary
                        :orderDecreaseInPercent="this.order.decreaseInPercent"
                        :orderDeliveryCostPerEverybody="this.order.deliveryCostPerEverybody"
                        :basePriceSum="this.baseOrderPrice"
                        :orderDeliveryCostPerDish="this.order.deliveryCostPerDish"
                        :allEatingPeopleCount="allEatingPeopleCount()"
                        :totalPrice="this.totalOrderPrice"
                    ></price-summary>
                  </v-col>

                  <v-col>
                    <PaymentOptionsSummary :order="order"></PaymentOptionsSummary>
                  </v-col>
                </v-row>

                <v-btn block color="success" v-if="canShowPlaceOrderButton()" @click="placeOrder"
                       :disabled="isPlaceOrderButtonDisabled()">
                  Place order &nbsp; <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </v-btn>

                <v-btn block color="success" v-if="this.isOrderOwner() && (this.orderState === 'ORDERED')"
                       @click="setAsDelivered">
                  Mark as delivered &nbsp; <i class="fa fa-arrow-right" aria-hidden="true"></i>
                </v-btn>

              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <template v-for="(orderEntry, entryId) in this.orderEntries">
        <v-container>
          <v-row>
            <v-col cols="xs12">
              <OrderEntriesCard :order="order"
                                :order-entry="orderEntry"
                                :entry-id="entryId"
                                :current-user-id="currentUserId">
              </OrderEntriesCard>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-if="order.orderState === 'CREATED' && numberOfCurrentUserEntries === 0">
        <v-container>
          <v-row>
            <v-col cols="xs12">
              <new-order-entry-card :is-entry-creating="isEntryCreating" :username="username"></new-order-entry-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

    </LoadingView>

  </ViewWrapper>
</template>

<script>
  import BackButton2 from '../commons/BackButton2.vue'
  import Price from '../commons/PriceElement.vue'
  import LoadingView from '../commons/LoadingView.vue'
  import OrderStateButtons from './components/OrderStateButtons.vue'
  import CreateOrderEntry from './components/orderEntry/CreateOrderEntry.vue'
  import EditOrderEntry from './components/orderEntry/EditOrderEntry.vue'
  import ShowOrderEntry from './components/orderEntry/ShowOrderEntry.vue'
  import {mapState} from 'vuex'
  import {
    UNLOCK_ORDER_ACTION,
    FETCH_ORDER_DATA_ACTION,
    NAMESPACE_SHOW_ORDER,
    SET_ORDER_AS_DELIVERED_ACTION,
  } from "../../store/modules/ShowOrderState"
  import router from '../../router/index'
  import PriceSummary from "./components/PriceSummary";
  import SimpleCard from "../commons/SimpleCard";
  import ViewWrapper from "../commons/ViewWrapper";
  import CustomPolyfills from "../../lib/CustomPolyfills";
  import PaymentStatus from "./components/PaymentStatus";
  import OrderEntriesCard from "./components/orderEntry/OrderEntriesCard";
  import NewOrderEntryCard from "./components/orderEntry/NewOrderEntryCard";
  import OrderDataSummary from "./components/OrderDataSummary";
  import PaymentOptionsSummary from "./components/PaymentOptionsSummary";
  import OrderLockedWarning from "./components/OrderLockedWarning";

  export default {
    data() {
      return {
        orderId: this.$route.params.id,
      }
    },
    mounted() {
      this.fetchOrder()
    },
    methods: {
      title() {
        return `[${this.order.orderState}] Order from ${this.order.restaurantName} (${this.order.orderDate})`
      },
      fetchOrder() {
        this.$store.commit('setLoadingTrue');
        return this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, {orderId: this.orderId});
      },
      isOrdering() {
        return this.order.orderState === 'ORDERING';
      },
      isOrderOwner() {
        return this.order.orderCreatorId === this.currentUserId
      },
      placeOrder() {
        router.push("/orders/" + this.orderId + "/order_view")
      },
      unlockOrder() {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${UNLOCK_ORDER_ACTION}`, {orderId: this.orderId})
      },
      setAsDelivered() {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_DELIVERED_ACTION}`, {orderId: this.orderId});
      },
      edit() {
        router.push("/orders/" + this.orderId + '/edit')
      },
      canShowPlaceOrderButton() {
        return this.isOrderOwner() && (this.orderState === 'CREATED' || this.orderState === 'ORDERING')
      },
      isPlaceOrderButtonDisabled() {
        return this.orderEntries.length === 0
      },
      allEatingPeopleCount() {
        return CustomPolyfills.flatMap(this.orderEntries, e => e.dishEntries).length;
      }
    },
    computed: {
      numberOfCurrentUserEntries() {
        return this.orderEntries.filter(e => e.userId === this.currentUserId).length;
      },
      orderState() {
        return this.$store.state.showOrder.order.orderState;
      },
      ...mapState({
        username: state => state.username,
      }),
      ...mapState('showOrder', [
        "order",
        "orderEntries",
        "currentUserId",
        "totalOrderPrice",
        "baseOrderPrice"
      ]),
      ...mapState('modifyOrderEntry', [
        "isEntryCreating",
        "isEntryEdited",
        "orderEntryId",
        "dishEntryId",
      ]),
      loading() {
        return this.$store.state.loading;
      }
    },
    components: {
      OrderLockedWarning,
      PaymentOptionsSummary,
      OrderDataSummary,
      NewOrderEntryCard,
      OrderEntriesCard,
      PaymentStatus,
      ViewWrapper,
      SimpleCard,
      PriceSummary,
      BackButton2,
      Price,
      LoadingView,
      OrderStateButtons,
      CreateOrderEntry,
      EditOrderEntry,
      ShowOrderEntry
    }
  }
</script>

<style scoped>
</style>
