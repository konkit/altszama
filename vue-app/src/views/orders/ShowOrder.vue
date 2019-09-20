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
      <v-card v-if="this.isOrdering() && this.isOrderOwner()">
        <v-card-text>
          <v-container>
            <v-layout row>
              <v-flex xs12>
                <v-alert :value="true" color="warning"
                         icon="new_releases" outline>
                  <p><strong>The order is locked!</strong></p>

                  <p>
                    The order is locked in ordering state and the order entries are freezed.<br/>
                    If you are not ordering yet, click button to go back to created state.
                  </p>

                  <p>
                    <v-btn color="success" @click="unlockOrder()">
                      Unlock&nbsp;&nbsp;<span class="fa fa-unlock"></span>
                    </v-btn>

                    <v-btn color="success" @click="placeOrder()">
                      Place order&nbsp;&nbsp;<span class="fa fa-arrow-right"></span>
                    </v-btn>
                  </p>
                </v-alert>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>


      <v-card>
        <v-card-text>
          <div class="py-2">
            <b>Menu:&nbsp;</b>
            <a target="_blank" :href="order.restaurantUrl">{{order.restaurantUrl}}</a>
          </div>

          <div class="order-data py-2">
            <div>
              Who will order? <b>{{ this.order.orderCreatorUsername }}</b>
            </div>

            <div>
              When? <b>{{ this.order.timeOfOrder }}</b>
            </div>

            <div>
              When it'll arrive? <b>{{ this.timeOfDeliveryOrNA() }}</b>
            </div>
          </div>

          <div class="py-2">
          <price-summary
              :orderDecreaseInPercent="this.order.decreaseInPercent"
              :orderDeliveryCostPerEverybody="this.order.deliveryCostPerEverybody"
              :basePriceSum="this.baseOrderPrice"
              :orderDeliveryCostPerDish="this.order.deliveryCostPerDish"
              :allEatingPeopleCount="allEatingPeopleCount()"
              :totalPrice="this.totalOrderPrice"
          >
          </price-summary>
          </div>

          <div class="py-2">
            <span v-if="this.order.paymentByCash == true" class="payment-entry">
              <v-chip color="green" text-color="white">
                Payment by cash &nbsp; <span class="fa fa-check"></span>
              </v-chip>
            </span>
            <span v-if="this.order.paymentByCash == false" class="payment-entry">
              <v-chip color="red" text-color="white">
                Payment by cash &nbsp; <span class="fa fa-times"></span>
              </v-chip>
            </span>

            <span v-if="this.order.paymentByBankTransfer == true" class="payment-entry">
              <v-chip color="green" text-color="white">
                Payment by bank transfer &nbsp; <span class="fa fa-check"></span>
              </v-chip>
            </span>
            <span v-if="this.order.paymentByBankTransfer == false" class="payment-entry">
              <v-chip color="red" text-color="white">
                Payment by bank transfer &nbsp; <span class="fa fa-times"></span>
              </v-chip>
            </span>

            <span v-if="this.order.paymentByBlik == true" class="payment-entry">
              <v-chip color="green" text-color="white">
                Payment by BLIK &nbsp; <span class="fa fa-check"></span>
              </v-chip>
            </span>
            <span v-if="this.order.paymentByBlik == false" class="payment-entry">
              <v-chip color="red" text-color="white">
                Payment by BLIK &nbsp; <span class="fa fa-times"></span>
              </v-chip>
            </span>

            <div v-if="order.paymentByBankTransfer">
              Bank transfer number: {{ order.bankTransferNumber }}
            </div>

            <div v-if="order.paymentByBankTransfer">
              BLIK phone number: {{ order.blikPhoneNumber }}
            </div>
          </div>


          <v-btn block color="success" v-if="canShowPlaceOrderButton()" @click="placeOrder"
                 :disabled="isPlaceOrderButtonDisabled()">
            Place order&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
          </v-btn>

          <v-btn block color="success" v-if="this.isOrderOwner() && (this.orderState === 'ORDERED')"
                 @click="setAsDelivered">
            Mark as delivered&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
          </v-btn>

        </v-card-text>
      </v-card>

      <template v-for="(orderEntry, entryId) in this.orderEntries">
        <OrderEntryCard :order="order"
                        :order-entry="orderEntry"
                        :entry-id="entryId"
                        :current-user-id="currentUserId">
        </OrderEntryCard>
      </template>

      <template v-if="order.orderState === 'CREATED' && numberOfCurrentUserEntries === 0">
        <new-order-entry-card :is-entry-creating="isEntryCreating" :username="username"></new-order-entry-card>
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
    DELETE_DISH_ENTRY_ACTION,
    UNLOCK_ORDER_ACTION,
    FETCH_ORDER_DATA_ACTION,
    NAMESPACE_SHOW_ORDER,
    SET_ORDER_AS_CREATED_ACTION,
    SET_ORDER_AS_ORDERED_ACTION,
    SET_ORDER_AS_DELIVERED_ACTION,
    SET_ORDER_AS_REJECTED_ACTION,
    DELETE_ORDER_ACTION,
  } from "../../store/modules/ShowOrderState"
  import {
    SET_DISH_ENTRY_CREATING,
    SET_DISH_ENTRY_EDITING,
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY,
  } from "../../store/modules/ModifyOrderEntryState";
  import router from '../../router/index'
  import PriceSummary from "./components/PriceSummary";
  import SimpleCard from "../commons/SimpleCard";
  import ViewWrapper from "../commons/ViewWrapper";
  import CustomPolyfills from "../../lib/CustomPolyfills";
  import PaymentStatus from "./components/PaymentStatus";
  import OrderEntryCard from "./components/orderEntry/OrderEntryCard";
  import NewOrderEntryCard from "./components/orderEntry/NewOrderEntryCard";

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
      paymentStatus(orderEntry) {
        if (orderEntry.paymentStatus === "UNPAID") {
          return "Unpaid"
        } else if (orderEntry.paymentStatus === "MARKED") {
          return "Marked as paid"
        } else if (orderEntry.paymentStatus === "CONFIRMED") {
          return "Payment confirmed"
        } else {
          return orderEntry.paymentStatus
        }
      },
      placeOrder() {
        router.push("/orders/" + this.orderId + "/order_view")
      },
      unlockOrder() {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${UNLOCK_ORDER_ACTION}`, {orderId: this.orderId})
      },
      createEntry() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_CREATING}`, {})
      },
      editDishEntry(orderEntryId, dishEntryId) {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_EDITING}`, {
          orderEntryId: orderEntryId,
          dishEntryId: dishEntryId
        })
      },
      editDishEntry() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_EDITING}`, {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        })
      },
      deleteDishEntry(orderEntryId, dishEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${DELETE_DISH_ENTRY_ACTION}`, {
          orderEntryId: orderEntryId,
          dishEntryId: dishEntryId
        })
      },
      deleteDishEntry() {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${DELETE_DISH_ENTRY_ACTION}`, {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        });
      },
      cancelEdit() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
      },
      setAsCreated() {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_CREATED_ACTION}`, {orderId: this.orderId});
      },
      setAsOrdered() {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_ORDERED_ACTION}`, {orderId: this.orderId});
      },
      setAsDelivered() {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_DELIVERED_ACTION}`, {orderId: this.orderId});
      },
      setAsRejected() {
        return this.$store.dispatch(`showOrder/${SET_ORDER_AS_REJECTED_ACTION}`, {orderId: this.orderId});
      },
      deleteDishEntry() {
        return this.$store.dispatch(`showOrder/${DELETE_ORDER_ACTION}`, {orderId: this.orderId});
      },
      placeOrder() {
        router.push("/orders/" + this.orderId + '/order_view')
      },
      edit() {
        router.push("/orders/" + this.orderId + '/edit')
      },
      timeOfDeliveryOrNA() {
        if (this.order.timeOfDelivery != null) {
          return this.order.timeOfDelivery
        } else {
          return "As ASAP as possible"
        }
      },
      isOrderOwner() {
        return this.order.orderCreatorId === this.currentUserId
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
      NewOrderEntryCard,
      OrderEntryCard,
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

  .user-order-col {
    min-width: 0;
  }

  .allowed {
    color: green;
  }

  .not-allowed {
    color: red;
  }

  .payment-entry {
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
