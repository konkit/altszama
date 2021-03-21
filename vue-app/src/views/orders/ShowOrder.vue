<template>
  <ViewWrapper>
    <LoadingView>
      <v-container v-if="this.isOrdering() && this.isOrderOwner()">
        <v-row>
          <v-col :cols="12">
            <OrderLockedWarning :order-id="this.orderId"></OrderLockedWarning>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-col :cols="12" :md="4">
            <h1>Order details</h1>
            <OrderDataSummary :order="order"></OrderDataSummary>
          </v-col>

          <v-col :cols="12" :md="4">
            <h1>Price summary</h1>

            <price-summary :orderDecreaseInPercent="this.order.deliveryData.decreaseInPercent"
                           :orderDeliveryCostPerEverybody="this.order.deliveryData.deliveryCostPerEverybody"
                           :orderDeliveryCostPerDish="this.order.deliveryData.deliveryCostPerDish"
                           :basePriceSum="this.baseOrderPrice"
                           :allEatingPeopleCount="allEatingPeopleCount()"
                           :totalPrice="this.totalOrderPrice">
            </price-summary>
          </v-col>

          <v-col :cols="12" :md="4">
            <h1>Payment options</h1>

            <PaymentOptionsSummary :payment-data="order.paymentData"></PaymentOptionsSummary>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="d-flex flex-row flex-wrap">
              <div class="mr-4 menu-link">
                <b class="mr-2">See menu at &nbsp;</b>
                <a v-if="order.restaurantUrl" target="_blank" :href="order.restaurantUrl">{{ order.restaurantUrl }}</a>
                <i v-if="!order.restaurantUrl">Sorry, no menu url specified</i>
              </div>
              <div class="d-flex ml-auto">
                <template v-if="canShowPlaceOrderButton() && isPlaceOrderButtonDisabled()">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-btn color="primary" :disabled="true">
                          Place order <i class="pl-2 fa fa-arrow-right" aria-hidden="true"></i>
                        </v-btn>
                      </div>
                    </template>
                    <span>You cannot place an empty order. Choose a dish first.</span>
                  </v-tooltip>
                </template>

                <template v-if="canShowPlaceOrderButton() && !isPlaceOrderButtonDisabled()">
                  <v-btn color="primary" @click="placeOrder">
                    Place order <i class="pl-2 fa fa-arrow-right" aria-hidden="true"></i>
                  </v-btn>
                </template>

                <v-btn color="primary" v-if="canShowMarkAsDeliveredButton()" @click="setAsDelivered()">
                  Mark as delivered <i class="pl-2 fa fa-arrow-right" aria-hidden="true"></i>
                </v-btn>

                <v-btn v-if="isOrderOwner()" @click="goToEditOrder">
                  Edit order <i class="pl-2 fa fa-cog" aria-hidden="true"></i>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <template v-if="shouldDisplayNewOrderEntryCard()">
          <v-row>
            <v-col>
              <new-order-entry-card :is-entry-creating="isEntryCreating" :username="username">
              </new-order-entry-card>
            </v-col>
          </v-row>
        </template>

        <template v-for="(orderEntry, entryId) in this.yourOrderEntries">
          <v-row :key="orderEntry.id + entryId">
            <v-col>
              <OrderEntriesCard :order="order" :order-entry="orderEntry" :entry-id="entryId"
                                :current-user-id="currentUserId">
              </OrderEntriesCard>
            </v-col>
          </v-row>
        </template>

        <template v-for="(orderEntry, entryId) in this.otherUsersOrderEntries">
          <v-row :key="orderEntry.id + entryId">
            <v-col>
              <OrderEntriesCard :order="order" :order-entry="orderEntry" :entry-id="entryId"
                                :current-user-id="currentUserId">
              </OrderEntriesCard>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import LoadingView from "@/views/commons/LoadingView.vue";
import {ShowOrderState} from "@/store/modules/ShowOrderModule";
import router from "@/router/index";
import PriceSummary from "@/views/orders/components/PriceSummary.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import OrderEntriesCard from "@/views/orders/components/orderEntry/OrderEntriesCard.vue";
import NewOrderEntryCard from "@/views/orders/components/orderEntry/NewOrderEntryCard.vue";
import OrderDataSummary from "@/views/orders/components/OrderDataSummary.vue";
import PaymentOptionsSummary from "@/views/orders/components/PaymentOptionsSummary.vue";
import OrderLockedWarning from "@/views/orders/components/OrderLockedWarning.vue";
import Component from "vue-class-component";
import Vue from "vue";
import {ParticipantsOrderEntry, ShowOrderDto} from "../../frontend-client";
import ErrorHandler from "@/lib/ErrorHandler";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  components: {
    OrderLockedWarning,
    PaymentOptionsSummary,
    OrderDataSummary,
    NewOrderEntryCard,
    OrderEntriesCard,
    ViewWrapper,
    PriceSummary,
    LoadingView
  }
})
export default class ShowOrder extends Vue {
  orderId = "";

  ordersConnector = new OrdersApiConnector()

  mounted() {
    this.orderId = this.$route.params.id;
    this.fetchOrder();
  }

  fetchOrder() {
    this.$store.commit("setLoadingTrue");
    this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.orderId);
  }

  isOrdering() {
    return this.order.orderState === OrderStateEnum.ORDERING;
  }

  isOrderOwner() {
    return this.order.orderCreatorId === this.currentUserId;
  }

  placeOrder() {
    router.push({name: "OrderView", params: {id: this.orderId}});
  }

  setAsDelivered() {
    this.ordersConnector
        .setOrderAsDelivered(this.orderId)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.$store.state.showOrder.order.id);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  goToEditOrder() {
    router.push({name: "OrderEditForm", params: {id: this.orderId}});
  }

  canShowPlaceOrderButton() {
    return this.isOrderOwner() && [OrderStateEnum.CREATED, OrderStateEnum.ORDERING].includes(this.orderState);
  }

  canShowMarkAsDeliveredButton() {
    return this.isOrderOwner() && this.orderState === OrderStateEnum.ORDERED;
  }

  isPlaceOrderButtonDisabled() {
    return this.orderEntries.length === 0;
  }

  allEatingPeopleCount() {
    this.orderEntries.flatMap(e => e.dishEntries).length;
  }

  get numberOfCurrentUserEntries() {
    return this.orderEntries.filter(e => e.userId === this.currentUserId)
        .length;
  }

  get orderState() {
    const showOrder: ShowOrderState = this.$store.state.showOrder;
    return showOrder.order.orderState;
  }

  get order() {
    const showOrder: ShowOrderState = this.$store.state.showOrder;
    return showOrder.order;
  }

  get orderEntries(): ParticipantsOrderEntry[] {
    const showOrder: ShowOrderState = this.$store.state.showOrder;
    return showOrder.orderEntries;
  }

  get yourOrderEntries(): ParticipantsOrderEntry[] {
    const showOrder: ShowOrderState = this.$store.state.showOrder;
    return showOrder.orderEntries.filter(e => e.userId === this.currentUserId);
  }

  get otherUsersOrderEntries(): ParticipantsOrderEntry[] {
    const showOrder: ShowOrderState = this.$store.state.showOrder;
    return showOrder.orderEntries.filter(e => e.userId !== this.currentUserId);
  }

  get currentUserId(): string {
    const showOrder: ShowOrderState = this.$store.state.showOrder;
    return showOrder.currentUserId;
  }

  get totalOrderPrice() {
    const showOrder: ShowOrderState = this.$store.state.showOrder;
    return showOrder.totalOrderPrice;
  }

  get baseOrderPrice() {
    const showOrder: ShowOrderState = this.$store.state.showOrder;
    return showOrder.baseOrderPrice;
  }

  get isEntryCreating() {
    return this.$store.state.modifyOrderEntry.isEntryCreating;
  }

  get username() {
    return this.$store.state.username;
  }

  shouldDisplayNewOrderEntryCard() {
    return this.order.orderState == OrderStateEnum.CREATED && this.numberOfCurrentUserEntries === 0
  }
}
</script>

<style scoped>
.menu-link {
  line-height: 36px;
}
</style>
