<template>
  <WithSpinner>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <back-button href="#/orders"/>

          <h1>[{{ this.order.orderState }}] Order from {{this.order.restaurant.name}} ({{this.order.orderDate}})</h1>

          <template v-if="isOrderOwner()">
            <order-state-buttons :order-id="this.order.id" :order-state="this.order.orderState"></order-state-buttons>
          </template>

          <div v-if="this.isOrdering() && this.isOrderOwner()" class="alert alert-warning">
            <p><strong>The order is locked!</strong></p>

            <p>
              The order is locked in ordering state and the order entries are freezed.<br/>
              If you are not ordering yet, click button to go back to created state.
            </p>
            <p>
              <button class="btn btn-success" @click="unlockOrder()">Unlock&nbsp;&nbsp;<span class="fa fa-unlock"/>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <order-stats :order="order" :total-order-price="totalOrderPrice"></order-stats>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <table class="table">
            <tr>
              <th class="names-person">Eating person</th>
              <th>Dish</th>
            </tr>

            <template v-if="order.orderState === 'CREATED' && numberOfCurrentUserEntries == 0">
              <tr>
                <td>{{username}}</td>

                <td>
                  <template v-if="isEntryCreating == false">
                    <button class="btn btn-success" @click="createEntry()">
                      Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                    </button>
                  </template>

                  <template v-if="isEntryCreating == true">
                    <order-entry-create-entry
                        :order="order"
                        @updateOrder="fetchOrder"/>
                  </template>
                </td>
              </tr>
            </template>

            <template v-for="(orderEntry, entryId) in this.orderEntries">
              <tr :key="entryId">
                <td>{{orderEntry.user.username}}</td>

                <td>
                  <template v-for="dishEntry in orderEntry.dishEntries">
                    <template v-if="isEntryEdited == true && dishEntryId == dishEntry.id">
                      <order-entry-edit-entry
                          :order="order"
                          :order-entry="orderEntry"
                          :dish-entry="dishEntry"
                          @updateOrder="fetchOrder"
                          :key="dishEntry.id"/>
                    </template>
                    <template v-else>
                      <order-entry-row
                          :order="order"
                          :order-entry="orderEntry"
                          :dish-entry="dishEntry"
                          :current-user-id="currentUserId"
                          @deleteEntry="deleteEntry"
                          @updateOrder="fetchOrder"
                          :key="dishEntry.id"/>
                    </template>
                  </template>

                  <template
                      v-if="order.orderState === 'CREATED' && isOrderEntryOwner(orderEntry) && isEntryEdited == false">
                    <div v-if="isEntryCreating == false">
                      <button class="btn btn-success" @click="createEntry()">
                        Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                      </button>
                    </div>
                    <div v-if="isEntryCreating == true">
                      <order-entry-create-entry
                          :order="order"
                          @updateOrder="fetchOrder"/>
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
        </div>
      </div>
    </div>

  </WithSpinner>
</template>

<script>
  import BackButton from '../../components/commons/BackButton.vue'
  import Price from '../../components/commons/PriceElement.vue'
  import Spinner from '../../components/commons/Spinner.vue'
  import WithSpinner from '../../components/commons/WithSpinner.vue'
  import OrderStateButtons from '../../components/orders/OrderStateButtons.vue'
  import OrderEntryCreateEntry from '../../components/orders/OrderEntryCreateEntry.vue'
  import OrderEntryEditEntry from '../../components/orders/OrderEntryEditEntry.vue'
  import OrderEntryRow from '../../components/orders/OrderEntryRow.vue'
  import OrderStats from '../../components/orders/OrderStats.vue'
  import {mapState} from 'vuex'
  import {
    DELETE_ORDER_ACTION,
    SET_ORDER_AS_REJECTED_ACTION,
    SET_ORDER_AS_DELIVERED_ACTION,
    SET_ORDER_AS_ORDERED_ACTION,
    SET_ORDER_AS_CREATED_ACTION,
    MARK_ORDER_ENTRY_AS_PAID_ACTION,
    CONFIRM_ORDER_ENTRY_AS_PAID_ACTION,
    DELETE_DISH_ENTRY_ACTION,
    UNLOCK_ORDER_ACTION,
    EDIT_ORDER_ENTRY_ACTION,
    SAVE_ORDER_ENTRY_ACTION,
    FETCH_ORDER_DATA_ACTION,
    CANCEL_ENTRY_CREATE_OR_EDIT,
    CLEAR_EDITED_SIDE_DISHES,
    LOAD_SHOW_ORDER_DATA,
    SET_EDITED_ORDER_ENTRY,
    SET_ENTRY_CREATING,
    SET_ENTRY_EDITING,
    SET_NEW_DISH_FLAG
  } from "../../store/modules/ShowOrderState"

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
      fetchOrder: function () {
        this.$store.commit('setLoadingTrue');
        this.$store.dispatch(`showOrder/${FETCH_ORDER_DATA_ACTION}`, {orderId: this.orderId});
      },
      isOrdering: function () {
        return this.order.orderState === 'ORDERING';
      },
      isOrderOwner: function () {
        return this.order.orderCreator.id == this.currentUserId
      },
      isOrderEntryOwner: function (orderEntry) {
        return orderEntry.user.id === this.currentUserId
      },
      paymentStatus: function (orderEntry) {
        if (orderEntry.paymentStatus == "UNPAID") {
          return "Unpaid"
        } else if (orderEntry.paymentStatus == "MARKED") {
          return "Marked as paid"
        } else if (orderEntry.paymentStatus == "CONFIRMED") {
          return "Payment confirmed"
        } else {
          return orderEntry.paymentStatus
        }
      },
      unlockOrder: function () {
        this.$store.dispatch(`showOrder/${UNLOCK_ORDER_ACTION}`, {orderId: this.orderId})
      },
      deleteEntry: function (orderEntryId, dishEntryId) {
        this.$store.dispatch(`showOrder/${DELETE_DISH_ENTRY_ACTION}`, {
          orderId: this.orderId,
          orderEntryId: orderEntryId,
          dishEntryId: dishEntryId
        })
      },
      createEntry: function () {
        this.$store.commit(`showOrder/${SET_ENTRY_CREATING}`, {})
      },
      editEntry: function (orderEntryId, dishEntryId) {
        this.$store.commit(`showOrder/${SET_ENTRY_EDITING}`, {
          "orderEntryId": orderEntryId,
          "dishEntryId": dishEntryId
        })
      },
      cancelEdit: function () {
        this.$store.commit(`showOrder/${CANCEL_ENTRY_CREATE_OR_EDIT}`, {})
      }
    },
    computed: {
      numberOfCurrentUserEntries() {
        return this.orderEntries.filter(e => e.user.id == this.currentUserId).length;
      },
      ...mapState({
        username: state => state.username,
      }),
      ...mapState('showOrder', [
        "order",
        "orderEntries",
        "currentUserId",
        "isEntryCreating",
        "isEntryEdited",
        "orderEntryId",
        "dishEntryId",
        "totalOrderPrice",
      ])
    },
    components: {
      BackButton,
      Price,
      Spinner,
      WithSpinner,
      OrderStateButtons,
      OrderEntryCreateEntry,
      OrderEntryEditEntry,
      OrderEntryRow,
      OrderStats
    }
  }
</script>

<style scoped>
  .container {
    max-width: 1000px;
  }

  .row {
    margin-top: 2rem;
  }

  .names-person {
    width: 250px;
  }
</style>
