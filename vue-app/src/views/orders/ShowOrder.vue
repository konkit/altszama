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
            <OrderLockedWarning :order-id="this.orderId"> </OrderLockedWarning>
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
                :orderDecreaseInPercent="
                  this.order.deliveryData.decreaseInPercent
                "
                :orderDeliveryCostPerEverybody="
                  this.order.deliveryData.deliveryCostPerEverybody
                "
                :orderDeliveryCostPerDish="
                  this.order.deliveryData.deliveryCostPerDish
                "
                :basePriceSum="this.baseOrderPrice"
                :allEatingPeopleCount="allEatingPeopleCount()"
                :totalPrice="this.totalOrderPrice"
              ></price-summary>
            </v-card>
          </v-col>

          <v-col :cols="12" :md="4">
            <v-card class="asdf-card">
              <v-card-title>Payment options</v-card-title>

              <PaymentOptionsSummary
                :payment-data="order.paymentData"
              ></PaymentOptionsSummary>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <div class="py-2 px-4">
              <b>See menu at &nbsp;</b>
              <a target="_blank" :href="order.restaurantUrl">{{
                order.restaurantUrl
              }}</a>
            </div>
          </v-col>
          <v-col>
            <v-btn
              block
              color="success"
              v-if="canShowPlaceOrderButton()"
              @click="placeOrder"
              :disabled="isPlaceOrderButtonDisabled()"
            >
              Place order &nbsp;
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </v-btn>

            <v-btn
              block
              color="success"
              v-if="this.isOrderOwner() && this.orderState === 'ORDERED'"
              @click="setAsDelivered()"
            >
              Mark as delivered &nbsp;
              <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </v-btn>
          </v-col>
        </v-row>

        <template v-for="(orderEntry, entryId) in this.orderEntries">
          <v-row :key="entryId">
            <v-col>
              <OrderEntriesCard
                :order="order"
                :order-entry="orderEntry"
                :entry-id="entryId"
                :current-user-id="currentUserId"
              >
              </OrderEntriesCard>
            </v-col>
          </v-row>
        </template>

        <template
          v-if="
            order.orderState === 'CREATED' && numberOfCurrentUserEntries === 0
          "
        >
          <v-row>
            <v-col>
              <new-order-entry-card
                :is-entry-creating="isEntryCreating"
                :username="username"
              ></new-order-entry-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import LoadingView from "@/views/commons/LoadingView.vue";
import {
  FETCH_ORDER_DATA_ACTION,
  NAMESPACE_SHOW_ORDER,
  SET_ORDER_AS_DELIVERED_ACTION,
  ShowOrderState,
  UNLOCK_ORDER_ACTION
} from "@/store/modules/ShowOrderModule";
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
import { ParticipantsOrderEntry, ShowOrderDto } from "../../frontend-client";
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

  mounted() {
    this.orderId = this.$route.params.id;
    this.fetchOrder();
  }

  title() {
    return `[${this.order.orderState}] Order from ${this.order.restaurantName} (${this.order.orderDate})`;
  }

  fetchOrder() {
    this.$store.commit("setLoadingTrue");
    return this.$store.dispatch(
      `${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`,
      this.orderId
    );
  }

  isOrdering() {
    return this.order.orderState === OrderStateEnum.ORDERING;
  }

  isOrderOwner() {
    return this.order.orderCreatorId === this.currentUserId;
  }

  placeOrder() {
    router.push("/orders/" + this.orderId + "/order_view");
  }

  unlockOrder() {
    this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${UNLOCK_ORDER_ACTION}`, {
      orderId: this.orderId
    });
  }

  setAsDelivered() {
    return this.$store.dispatch(`showOrder/${SET_ORDER_AS_DELIVERED_ACTION}`, {
      orderId: this.orderId
    });
  }

  edit() {
    router.push("/orders/" + this.orderId + "/edit");
  }

  canShowPlaceOrderButton() {
    return (
      this.isOrderOwner() &&
      (this.orderState === OrderStateEnum.CREATED ||
        this.orderState === OrderStateEnum.ORDERING)
    );
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

  get isEntryEdited() {
    return this.$store.state.modifyOrderEntry.isEntryEdited;
  }

  get username() {
    return this.$store.state.username;
  }

  get loading() {
    return this.$store.state.loading;
  }
}
</script>

<style scoped>
.asdf-card {
  min-height: 300px;
}
</style>
