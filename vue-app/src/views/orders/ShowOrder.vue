<template>
  <LoadingView>
    <ViewWrapper>
      <template slot="toolbar">
        <back-button2 href="#/orders/"></back-button2>

        <v-toolbar-title>
          [{{ this.order.orderState }}] Order from {{this.order.restaurantName}} ({{this.order.orderDate}})
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="isOrderOwner()">
          <v-btn @click="edit">
            <i class="fa fa-cog" aria-hidden="true"></i>
          </v-btn>
        </template>
      </template>

      <simple-card>
        <v-container>
          <v-layout row>
            <v-flex xs12>
              <v-alert v-if="this.isOrdering() && this.isOrderOwner()" :value="true" color="warning"
                       icon="new_releases">
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

          <v-layout row>
            <v-flex xs4>
              <h3>Order data</h3>

              <dt>Who will order?</dt>
              <dd><b>{{ this.order.orderCreatorUsername }}</b></dd>

              <dt>When?</dt>
              <dd><b>{{ this.order.timeOfOrder }}</b></dd>

              <dt>When it'll arrive?</dt>
              <dd><b>{{ this.timeOfDeliveryOrNA() }}</b></dd>
            </v-flex>

            <v-flex xs4>
              <price-summary
                  :orderDecreaseInPercent="this.order.decreaseInPercent"
                  :orderDeliveryCostPerEverybody="this.order.deliveryCostPerEverybody"
                  :basePriceSum="this.baseOrderPrice"
                  :orderDeliveryCostPerDish="this.order.deliveryCostPerDish"
                  :allEatingPeopleCount="this.orderEntries.flatMap(e => e.dishEntries).length"
                  :totalPrice="this.totalOrderPrice"
              >
              </price-summary>
            </v-flex>

            <v-flex xs4>
              <h3>Payment</h3>

              <p v-if="this.order.paymentByCash == true">
                <b class="allowed">
                  Payment by cash
                  <span class="fa fa-check"></span>
                </b>
              </p>
              <p v-if="this.order.paymentByCash == false">
                <b class="not-allowed">
                  Payment by cash
                  <span class="fa fa-times"></span>
                </b>
              </p>

              <p v-if="this.order.paymentByBankTransfer == true">
                <b class="allowed">
                  Payment by bank transfer
                  <span class="fa fa-check"></span>
                </b>
              </p>
              <p v-if="this.order.paymentByBankTransfer == false">
                <b class="not-allowed">
                  Payment by bank transfer
                  <span class="fa fa-times"></span>
                </b>
              </p>

              <dt v-if="order.paymentByBankTransfer">Bank transfer number</dt>
              <dd v-if="order.paymentByBankTransfer">{{ order.bankTransferNumber }}</dd>


              <p v-if="this.order.paymentByBlik == true">
                <b class="allowed">
                  Payment by BLIK
                  <span class="fa fa-check"></span>
                </b>
              </p>
              <p v-if="this.order.paymentByBlik == false">
                <b class="not-allowed">
                  Payment by BLIK
                  <span class="fa fa-times"></span>
                </b>
              </p>

              <dt v-if="order.paymentByBlik">BLIK phone number</dt>
              <dd v-if="order.paymentByBlik">{{ order.blikPhoneNumber }}</dd>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 class="py-3">
              <p>
                <b>Link to menu:&nbsp;</b>
                <a target="_blank" :href="order.restaurantUrl">{{order.restaurantUrl}}</a>
              </p>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn block color="success" v-if="this.isOrderOwner() && (this.orderState === 'CREATED' || this.orderState === 'ORDERING')"
                     @click="placeOrder">
                Place order&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
              </v-btn>

              <v-btn block color="success" v-if="this.isOrderOwner() && (this.orderState === 'ORDERED')" @click="setAsDelivered">
                Mark as delivered&nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
              </v-btn>
            </v-flex>
          </v-layout>

        </v-container>
      </simple-card>

      <simple-card>

          <template v-if="order.orderState === 'CREATED' && numberOfCurrentUserEntries === 0">
            <div class="row">
              <div class="user-name-col username pa-2">
                <div class="username-wrapper">
                  {{username}}
                </div>
              </div>

              <div class="user-order-col">
                <template v-if="isEntryCreating === false">
                  <v-btn color="success" @click="createEntry()">
                    Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                  </v-btn>
                </template>

                <template v-if="isEntryCreating === true">
                  <create-order-entry></create-order-entry>
                </template>
              </div>
            </div>
          </template>

          <template v-for="(orderEntry, entryId) in this.orderEntries">
            <div class="row" :key="entryId">
              <div class="user-name-col username pa-2">
                <div class="username-wrapper">
                    {{orderEntry.username}}
                </div>
              </div>

              <div class="user-order-col">
                <template v-for="(dishEntry, dishEntryIndex) in orderEntry.dishEntries">
                  <template v-if="isEntryEdited === true && dishEntryId === dishEntry.id">
                    <div class="pa-2">
                      <edit-order-entry
                          :order-entry="orderEntry"
                          :dish-entry="dishEntry"
                          :key="dishEntry.id">
                      </edit-order-entry>
                    </div>

                    <v-divider v-if="dishEntryIndex < orderEntry.dishEntries.length - 1"></v-divider>
                  </template>
                  <template v-else>
                    <div class="pa-2">
                      <order-entry
                          :order-entry="orderEntry"
                          :dish-entry="dishEntry"
                          :current-user-id="currentUserId"
                          :key="dishEntry.id">
                      </order-entry>
                    </div>

                    <v-divider></v-divider>
                  </template>
                </template>

                <template v-if="order.orderState === 'CREATED' && isOrderEntryOwner(orderEntry) && isEntryEdited === false">
                  <div v-if="isEntryCreating === false" class="pa-2">
                    <v-btn color="success" @click="createEntry()">
                      Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                    </v-btn>
                  </div>
                  <div v-if="isEntryCreating === true" class="pa-2">
                    <create-order-entry></create-order-entry>
                  </div>
                </template>

                <v-divider></v-divider>

                <div class="pa-2">
                  <b>Cost for user: <price :data-price="orderEntry.finalPrice"/></b>
                </div>
              </div>

              <div class="payment-status py-2 px-3" v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">

                  <template v-if="(isOrderEntryOwner(orderEntry) || isOrderOwner(order)) && (order.orderState === 'ORDERED' || order.orderState === 'DELIVERED')">
                    {{paymentStatus(orderEntry)}}
                  </template>

                  <template v-if="shouldShowMarkAsPaidButton(orderEntry)">
                    <v-btn icon color="success" @click="markAsPaid(orderEntry.id)">
                      <i class="fa fa-check" aria-hidden="true"></i>
                    </v-btn>
                  </template>

                  <template v-if="shouldShowConfirmAsPaidButton(orderEntry)">
                    <v-btn icon color="success" @click="confirmAsPaid(orderEntry.id)">
                      <i class="fa fa-check" aria-hidden="true"></i>
                    </v-btn>
                  </template>

              </div>
            </div>
            <div class="bottom-space"></div>
          </template>
      </simple-card>
    </ViewWrapper>
  </LoadingView>
</template>

<script>
  import BackButton2 from '../commons/BackButton2.vue'
  import Price from '../commons/PriceElement.vue'
  import LoadingView from '../commons/LoadingView.vue'
  import OrderStateButtons from './components/OrderStateButtons.vue'
  import CreateOrderEntry from './components/CreateOrderEntry.vue'
  import EditOrderEntry from './components/EditOrderEntry.vue'
  import OrderEntry from './components/OrderEntry.vue'
  import {mapState} from 'vuex'
  import {
    DELETE_DISH_ENTRY_ACTION,
    UNLOCK_ORDER_ACTION,
    FETCH_ORDER_DATA_ACTION,
    NAMESPACE_SHOW_ORDER,
    SET_ORDER_AS_CREATED_ACTION,
    SET_ORDER_AS_ORDERED_ACTION,
    SET_ORDER_AS_DELIVERED_ACTION,
    SET_ORDER_AS_REJECTED_ACTION, DELETE_ORDER_ACTION
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
      isOrderEntryOwner(orderEntry) {
        return orderEntry.userId === this.currentUserId
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
      deleteDishEntry(orderEntryId, dishEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${DELETE_DISH_ENTRY_ACTION}`, {
          orderEntryId: orderEntryId,
          dishEntryId: dishEntryId
        })
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
      isOrderEntryOwner(orderEntry) {
        return orderEntry.userId === this.currentUserId
      },
      shouldShowMarkAsPaidButton(orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && (orderEntry.paymentStatus !== "MARKED" && orderEntry.paymentStatus !== "CONFIRMED") && this.isOrderOwner() === false)
      },
      shouldShowConfirmAsPaidButton(orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && orderEntry.paymentStatus !== "CONFIRMED" && this.isOrderOwner() === true)
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
      confirmAsPaid(orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${CONFIRM_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      markAsPaid(orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${MARK_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      editDishEntry() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_EDITING}`, {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        })
      },
      deleteDishEntry() {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${DELETE_DISH_ENTRY_ACTION}`, {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        });
      },
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
      ])
    },
    components: {
      ViewWrapper,
      SimpleCard,
      PriceSummary,
      BackButton2,
      Price,
      LoadingView,
      OrderStateButtons,
      CreateOrderEntry,
      EditOrderEntry,
      OrderEntry
    }
  }
</script>

<style scoped>

  .row {
    display: flex;
    flex-direction: row;
  }

  .user-name-col {
    width: 200px;
    min-width: 200px;
  }

  .user-order-col {
    min-width: 0;
  }

  .username-wrapper {
    height: 50px;
  }

  .allowed {
    color: green;
  }

  .not-allowed {
    color: red;
  }

  .payment-status {
    margin-left: auto;
    white-space: nowrap;
  }

  .bottom-space {
    height: 30px;
  }

</style>
