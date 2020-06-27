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
          <v-col :cols="12">
            <OrderLockedWarning :order-id="this.orderId">
            </OrderLockedWarning>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-col :cols="12" :md="4">
            <v-card class="asdf-card">
              <v-card-title>Order details</v-card-title>
              <OrderDataSummary :order="order"></OrderDataSummary>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="4">
            <v-card class="asdf-card">
              <v-card-title>Price summary</v-card-title>

              <price-summary
                  :orderDecreaseInPercent="this.order.decreaseInPercent"
                  :orderDeliveryCostPerEverybody="this.order.deliveryCostPerEverybody"
                  :basePriceSum="this.baseOrderPrice"
                  :orderDeliveryCostPerDish="this.order.deliveryCostPerDish"
                  :allEatingPeopleCount="allEatingPeopleCount()"
                  :totalPrice="this.totalOrderPrice"
              ></price-summary>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="4">
            <v-card class="asdf-card">
              <v-card-title>Payment options</v-card-title>

              <PaymentOptionsSummary :order="order"></PaymentOptionsSummary>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="py-2 px-4">
              <b>See menu at &nbsp;</b> <a target="_blank"
                                           :href="order.restaurantUrl">{{order.restaurantUrl}}</a>
            </div>
          </v-col>
          <v-col>
            <v-btn block color="success" v-if="canShowPlaceOrderButton()" @click="placeOrder"
                   :disabled="isPlaceOrderButtonDisabled()">
              Place order &nbsp; <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </v-btn>

            <v-btn block color="success" v-if="this.isOrderOwner() && (this.orderState === 'ORDERED')"
                   @click="setAsDelivered">
              Mark as delivered &nbsp; <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </v-btn>
          </v-col>
        </v-row>

        <template v-for="(orderEntry, entryId) in this.orderEntries">
          <v-row :key="entryId">
            <v-col>
              <OrderEntriesCard :order="order"
                                :order-entry="orderEntry"
                                :entry-id="entryId"
                                :current-user-id="currentUserId">
              </OrderEntriesCard>
            </v-col>
          </v-row>
        </template>

        <template v-if="order.orderState === 'CREATED' && numberOfCurrentUserEntries === 0">
          <v-row>
            <v-col>
              <new-order-entry-card :is-entry-creating="isEntryCreating" :username="username"></new-order-entry-card>
            </v-col>
          </v-row>
        </template>

      </v-container>

    </LoadingView>

  </ViewWrapper>
</template>

<script lang="ts">
  import LoadingView from '../commons/LoadingView.vue'
  import {mapState} from 'vuex'
  import {
    FETCH_ORDER_DATA_ACTION,
    NAMESPACE_SHOW_ORDER,
    SET_ORDER_AS_DELIVERED_ACTION,
    UNLOCK_ORDER_ACTION,
  } from "../../store/modules/ShowOrderModule"
  import router from '../../router/index'
  import PriceSummary from "./components/PriceSummary";
  import ViewWrapper from "../commons/ViewWrapper";
  import CustomPolyfills from "../../lib/CustomPolyfills";
  import OrderEntriesCard from "./components/orderEntry/OrderEntriesCard";
  import NewOrderEntryCard from "./components/orderEntry/NewOrderEntryCard";
  import OrderDataSummary from "./components/OrderDataSummary";
  import PaymentOptionsSummary from "./components/PaymentOptionsSummary";
  import OrderLockedWarning from "./components/OrderLockedWarning";
  import Component from "vue-class-component";
  import Vue from "vue";

  @Component({
    computed: {
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
      ViewWrapper,
      PriceSummary,
      LoadingView,
    }
  })
  export default class ShowOrder extends Vue {
    orderId;

    mounted() {
      this.orderId = this.$route.params.id;
      this.fetchOrder()
    }

    title() {
      return `[${this.order.orderState}] Order from ${this.order.restaurantName} (${this.order.orderDate})`
    }

    fetchOrder() {
      this.$store.commit('setLoadingTrue');
      return this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, {orderId: this.orderId});
    }

    isOrdering() {
      return this.order.orderState === 'ORDERING';
    }

    isOrderOwner() {
      return this.order.orderCreatorId === this.currentUserId
    }

    placeOrder() {
      router.push("/orders/" + this.orderId + "/order_view")
    }

    unlockOrder() {
      this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${UNLOCK_ORDER_ACTION}`, {orderId: this.orderId})
    }

    setAsDelivered() {
      return this.$store.dispatch(`showOrder/${SET_ORDER_AS_DELIVERED_ACTION}`, {orderId: this.orderId});
    }

    edit() {
      router.push("/orders/" + this.orderId + '/edit')
    }

    canShowPlaceOrderButton() {
      return this.isOrderOwner() && (this.orderState === 'CREATED' || this.orderState === 'ORDERING')
    }

    isPlaceOrderButtonDisabled() {
      return this.orderEntries.length === 0
    }

    allEatingPeopleCount() {
      return CustomPolyfills.flatMap(this.orderEntries, e => e.dishEntries).length;
    }

    get numberOfCurrentUserEntries() {
      return this.orderEntries.filter(e => e.userId === this.currentUserId).length;
    }

    get orderState() {
      return this.$store.state.showOrder.order.orderState;
    }
  }
</script>

<style scoped>
  .asdf-card {
    min-height: 300px;
  }
</style>
