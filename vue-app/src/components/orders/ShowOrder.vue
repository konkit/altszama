<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button href="#/orders" />

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
              <p><button class="btn btn-success" @click="unlockOrder()">Unlock&nbsp;&nbsp;<span class="fa fa-unlock" /></button></p>
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
                        @updateOrder="fetchOrder" />
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
                            :key="dishEntry.id" />
                      </template>
                      <template v-else>
                        <order-entry-row 
                            :order="order" 
                            :order-entry="orderEntry" 
                            :dish-entry="dishEntry" 
                            :current-user-id="currentUserId"
                            @deleteEntry="deleteEntry"
                            @updateOrder="fetchOrder"
                            :key="dishEntry.id" />
                      </template>
                    </template>

                    <template v-if="order.orderState === 'CREATED' && isOrderEntryOwner(orderEntry) && isEntryEdited == false">
                      <div v-if="isEntryCreating == false">
                        <button class="btn btn-success" @click="createEntry()">
                          Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                        </button>
                      </div>
                      <div v-if="isEntryCreating == true">
                        <order-entry-create-entry 
                          :order="order"
                          @updateOrder="fetchOrder" />
                      </div>
                    </template>

                    <hr />

                    <b>Cost for user: <price :data-price="orderEntry.finalPrice" /></b> 
                  </td>
                </tr>
              </template>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import BackButton from '../commons/backButton.vue'
import Price from '../commons/priceElement.vue'
import Spinner from '../commons/spinner.vue'

import OrderStateButtons from './components/OrderStateButtons.vue'
import OrderEntryCreateEntry from './components/OrderEntryCreateEntry.vue'
import OrderEntryEditEntry from './components/OrderEntryEditEntry.vue'
import OrderEntryRow from './components/OrderEntryRow.vue'
import OrderStats from './components/OrderStats.vue'

import ApiConnector from '../../ApiConnector.js'


export default {
  data () {
    return {
      orderId: this.$route.params.id,
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    this.fetchOrder()
  },
  methods: {
    fetchOrder: function() {
      this.$store.commit('setLoadingTrue');
      ApiConnector.makeGet("/orders/" + this.orderId + "/show.json")
        .then(response => {
          var showOrderData = {
            order: response.data.order, 
            orderEntries: response.data.orderEntries, 
            currentUserId: response.data.currentUserId,
            allDishesInRestaurant: response.data.allDishesInRestaurant,
            allDishesByCategory: convertToMapEntries(response.data.allDishesByCategory),
            dishIdToSideDishesMap: response.data.dishIdToSideDishesMap,
            totalOrderPrice: response.data.totalOrderPrice
          };
          this.$store.commit('loadShowOrderData', showOrderData);

          this.$store.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    isOrdering: function() {
      return this.order.orderState === 'ORDERING';
    },
    isOrderOwner: function() {
      return this.order.orderCreator.id == this.currentUserId
    },
    isOrderEntryOwner: function(orderEntry) {
      return orderEntry.user.id === this.currentUserId
    },
    paymentStatus: function(orderEntry) {
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
    unlockOrder: function() {
      ApiConnector.makeGet('/orders/' + this.orderId + '/set_as_created')
        .then(response => this.fetchOrder())
    },
    deleteEntry: function(orderEntryId, dishEntryId) {
      ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
        .then(successResponse => this.fetchOrder())
        .catch(errResponse => console.log(errResponse) );
    },
    createEntry: function() {
      this.$store.commit('setEntryCreating', {})
    },
    editEntry: function(orderEntryId, dishEntryId) {
      this.$store.commit('setEntryEditing', {"orderEntryId": orderEntryId, "dishEntryId": dishEntryId})
    },
    cancelEdit: function() {
      this.$store.commit('cancelEntryCreateOrEdit', {})
    }
  },
  computed: {
    loading () { return this.$store.state.loading; },
    numberOfCurrentUserEntries () { return this.orderEntries.filter(e => e.user.id == this.currentUserId).length; },
    username () { return this.$store.state.username; },
    order () { return this.$store.state.order; },
    orderEntries () { return this.$store.state.orderEntries; },
    currentUserId () { return this.$store.state.currentUserId; },
    isEntryCreating () { return this.$store.state.isEntryCreating; },
    isEntryEdited () { return this.$store.state.isEntryEdited; },
    orderEntryId () { return this.$store.state.orderEntryId; },
    dishEntryId () { return this.$store.state.dishEntryId; },
    totalOrderPrice () { return this.$store.state.totalOrderPrice; }
  },
  components: {
    BackButton,
    Price,
    Spinner,
    OrderStateButtons,
    OrderEntryCreateEntry,
    OrderEntryEditEntry,
    OrderEntryRow,
    OrderStats
  }
}

function convertToMapEntries(dishesMap) {
  var result = [];
  
  for (const key of Object.keys(dishesMap)) {
    result.push({"category": key, "dishes": dishesMap[key]})
  }

  return result;
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
