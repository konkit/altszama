<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 href="#/orders/"></back-button2>

      <v-toolbar-title>
        [{{ this.order.orderState }}] Order from {{this.order.restaurantName}} ({{this.order.orderDate}})
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="isOrderOwner()">
        <order-state-buttons></order-state-buttons>
      </template>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
                <div v-if="this.isOrdering() && this.isOrderOwner()" class="alert alert-warning">
                  <p><strong>The order is locked!</strong></p>

                  <p>
                    The order is locked in ordering state and the order entries are freezed.<br/>
                    If you are not ordering yet, click button to go back to created state.
                  </p>

                  <p>
                    <button class="btn btn-success" @click="unlockOrder()">
                      Unlock&nbsp;&nbsp;<span class="fa fa-unlock"></span>
                    </button>

                    <button class="btn btn-success" @click="placeOrder()">
                      Place order&nbsp;&nbsp;<span class="fa fa-arrow-right"></span>
                    </button>
                  </p>
                </div>

                <order-stats></order-stats>

              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>

                <table class="table">
                  <tr>
                    <th class="names-person">Eating person</th>
                    <th>Dish</th>
                  </tr>

                  <template v-if="order.orderState === 'CREATED' && numberOfCurrentUserEntries === 0">
                    <tr>
                      <td>{{username}}</td>

                      <td>
                        <template v-if="isEntryCreating === false">
                          <button class="btn btn-success" @click="createEntry()">
                            Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                          </button>
                        </template>

                        <template v-if="isEntryCreating === true">
                          <create-order-entry></create-order-entry>
                        </template>
                      </td>
                    </tr>
                  </template>

                  <template v-for="(orderEntry, entryId) in this.orderEntries">
                    <tr :key="entryId">
                      <td>{{orderEntry.username}}</td>

                      <td>
                        <template v-for="dishEntry in orderEntry.dishEntries">
                          <template
                              v-if="isEntryEdited === true && dishEntryId === dishEntry.id">
                            <edit-order-entry
                                :order-entry="orderEntry"
                                :dish-entry="dishEntry"
                                :key="dishEntry.id">
                            </edit-order-entry>
                          </template>
                          <template v-else>
                            <order-entry
                                :order-entry="orderEntry"
                                :dish-entry="dishEntry"
                                :current-user-id="currentUserId"
                                :key="dishEntry.id"></order-entry>
                          </template>
                        </template>

                        <template
                            v-if="order.orderState === 'CREATED' && isOrderEntryOwner(orderEntry) && isEntryEdited === false">
                          <div v-if="isEntryCreating === false">
                            <button class="btn btn-success" @click="createEntry()">
                              Add entry &nbsp;<i class="fa fa-plus"
                                                 aria-hidden="true"></i>
                            </button>
                          </div>
                          <div v-if="isEntryCreating === true">
                            <create-order-entry></create-order-entry>
                          </div>
                        </template>

                        <hr/>

                        <b>Cost for user:
                          <price :data-price="orderEntry.finalPrice"/>
                        </b>
                      </td>
                    </tr>
                  </template>
                </table>

              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

  </LoadingView>
</template>

<script>
    import BackButton2 from '../../components/commons/BackButton2.vue'
    import Price from '../../components/commons/PriceElement.vue'
    import LoadingView from '../../components/commons/LoadingView.vue'
    import OrderStateButtons from '../../components/orders/OrderStateButtons.vue'
    import CreateOrderEntry from '../../components/orders/CreateOrderEntry.vue'
    import EditOrderEntry from '../../components/orders/EditOrderEntry.vue'
    import OrderEntry from '../../components/orders/OrderEntry.vue'
    import OrderStats from '../../components/orders/OrderStats.vue'
    import {mapState} from 'vuex'
    import {
        DELETE_DISH_ENTRY_ACTION,
        UNLOCK_ORDER_ACTION,
        FETCH_ORDER_DATA_ACTION,
        NAMESPACE_SHOW_ORDER
    } from "../../store/modules/ShowOrderState"
    import {
        SET_DISH_ENTRY_CREATING,
        SET_DISH_ENTRY_EDITING,
        CANCEL_DISH_ENTRY_MODIFICATION,
        NAMESPACE_MODIFY_ORDER_ENTRY,
    } from "../../store/modules/ModifyOrderEntryState";

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
                window.location = '#/orders/' + this.orderId + '/order_view'
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
            }
        },
        computed: {
            numberOfCurrentUserEntries() {
                return this.orderEntries.filter(e => e.userId === this.currentUserId).length;
            },
            ...mapState({
                username: state => state.username,
            }),
            ...mapState('showOrder', [
                "order",
                "orderEntries",
                "currentUserId",
            ]),
            ...mapState('modifyOrderEntry', [
                "isEntryCreating",
                "isEntryEdited",
                "orderEntryId",
                "dishEntryId",
            ])
        },
        components: {
            BackButton2,
            Price,
            LoadingView,
            OrderStateButtons,
            CreateOrderEntry,
            EditOrderEntry,
            OrderEntry,
            OrderStats
        }
    }
</script>

<style scoped>

  .names-person {
    width: 250px;
  }
</style>
