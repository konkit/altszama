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
              <order-state-buttons v-bind:order-id="this.order.id" v-bind:order-state="this.order.orderState"></order-state-buttons>
            </template>

            <div v-if="this.isOrdering() && this.isOrderOwner()" class="alert alert-warning">
              <p><strong>The order is locked!</strong></p>

              <p>
                The order is locked in ordering state and the order entries are freezed.<br/> 
                If you are not ordering yet, click button to go back to created state.
              </p>
              <p><button class="btn btn-success" v-on:click="unlockOrder()">Unlock&nbsp;&nbsp;<span class="fa fa-unlock" /></button></p>
            </div>
          </div>
        </div>
      </div>

      <order-stats :order="order"></order-stats>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <table class="table">
              <tr>
                <th class="names-person">Eating person</th>
                <th>Dish</th>
                <th class="actions-column">Actions</th>
              </tr>

              <template v-if="numberOfCurrentUserEntries == 0">
                <template v-if="isEntryEdited == false && numberOfCurrentUserEntries == 0">
                  <template v-if="isEntryCreating == false">
                    <tr>
                      <td>{{username}}</td>
                      <td>
                        <button class="btn btn-success" @click="createEntry()">
                          Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  </template>

                  <template v-if="isEntryCreating == true">
                    <order-entry-create-entry 
                    :order-id="order.id" 
                    :username="username" 
                    :entries-index="0"
                    @cancelEdit="cancelEdit" 
                    :rowspan="1" />
                  </template>
                </template>
              </template>

              <template v-for="orderEntry in this.orderEntries">
                <template v-for="(dishEntry, i) in orderEntry.dishEntries">
                  <template v-if="isEntryEdited == true && dishEntryId == dishEntry.id">
                    <order-entry-edit-entry 
                      :entriesIndex="i" 
                      :usersDishEntriesCount="orderEntry.dishEntries.length"
                      :username="username" 
                      :orderEntry="orderEntry" 
                      :dishEntry="dishEntry"
                      @cancelEdit="cancelEdit" />
                  </template>
                  <template v-else>
                    <tr>
                      <td v-if="i == 0" :rowspan="userColumnRowSpan(order, orderEntry)">
                        {{orderEntry.user.username}}
                      </td>

                      <td>
                        <p class="dish-name">
                          {{dishEntry.dish.name}} (<price :data-price="dishEntry.price"/>)
                        </p>
                        <p v-for="sideDish in dishEntry.sideDishes" class="side-dish-name">
                          + {{sideDish.name}} (<price :data-price="sideDish.price" />)
                        </p>
                        <p v-if="dishEntry.comments.length > 0" class="dish-comments">Additional comments: {{dishEntry.comments}}</p>
                      </td>

                      <td>
                        <div v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">

                          <div v-if="order.orderState === 'CREATED'">
                            <button type="button" class="btn btn-light" @click="editEntry(orderEntry.id, dishEntry.id)">
                              <i class="fa fa-pencil" aria-hidden="true" />
                            </button>

                            <button type="button" class="btn btn-danger" @click="deleteEntry(orderEntry.id, dishEntry.id)">
                              <i class="fa fa-times" aria-hidden="true" />
                            </button>
                          </div>

                          <div v-if="order.orderState === 'ORDERED' || order.orderState === 'DELIVERED'" >
                            {{paymentStatus(orderEntry)}}
                          </div>

                          <div v-if="shouldShowMarkAsPaidButton(orderEntry)">
                            <button type="button" class="btn btn-success" @click="markAsPaid(orderEntry.id)">
                              Mark as paid
                            </button>
                          </div>

                          <div v-if="shouldShowConfirmAsPaidButton(orderEntry)">
                            <button type="button" class="btn btn-success" @click="confirmAsPaid(orderEntry.id)">
                              Confirm as paid
                            </button>
                          </div>

                        </div>
                      </td>
                    </tr>
                  </template>
                </template>
                <template v-if="(isOrderEntryOwner(orderEntry) || isOrderOwner(order)) && isEntryEdited == false">
                  <tr v-if="isEntryCreating == false">
                    <td>
                      <button class="btn btn-success" @click="createEntry()">
                        Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="isEntryCreating == true">
                    <order-entry-create-entry 
                      :order-id="order.id" 
                      :username="orderEntry.user.username" 
                      :entries-index="1"
                      @cancelEdit="cancelEdit" 
                      :rowspan="orderEntry.dishEntries.length + 1" />
                  </tr>
                </template>
                <tr>
                  <td>
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
import Vue from 'vue'

import BackButton from '../commons/backButton.vue'
import Price from '../commons/priceElement.vue'
import Spinner from '../commons/spinner.vue'

import OrderStateButtons from './components/OrderStateButtons.vue'
import OrderEntryCreateEntry from './components/OrderEntryCreateEntry.vue'
import OrderEntryEditEntry from './components/OrderEntryEditEntry.vue'
import OrderStats from './components/OrderStats.vue'

import ApiConnector from '../../ApiConnector.js'


export default {
  data () {
    return {
      orderId: this.$route.params.id,

      results: {},
      order: '',
      orderEntries: [],
      currentUserId: '',

      isEntryCreating: false,
      isEntryEdited: false,
      orderEntryId: "",
      dishEntryId: "",
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/orders/" + this.orderId + "/show.json")
      .then(response => {
        this.results = response.data;
        this.order = response.data.order;
        this.orderEntries = response.data.orderEntries;
        this.currentUserId = response.data.currentUserId;

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    createEntryLink: function(orderId) {
      return '#/orders/' + orderId + '/create_entry'
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
    isNotOrderedYet: function() {
      return this.order.orderState === 'CREATED';
    },
    shouldShowMarkAsPaidButton: function(orderEntry) {
      return (this.order.orderState != 'CREATED' && this.order.orderState != 'ORDERING' && (orderEntry.paymentStatus != "MARKED" && orderEntry.paymentStatus != "CONFIRMED") && this.isOrderOwner() == false)
    },
    shouldShowConfirmAsPaidButton: function(orderEntry) {
      return (this.order.orderState != 'CREATED' && this.order.orderState != 'ORDERING' && orderEntry.paymentStatus != "CONFIRMED" && this.isOrderOwner() == true)
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
        .then(response => {
          window.location.reload()
        })
    },
    confirmAsPaid: function(orderEntryId) {
      ApiConnector.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid')
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse) );
    },
    markAsPaid: function(orderEntryId) {
      ApiConnector.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid')
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse) );
    },
    deleteEntry: function(orderEntryId, dishEntryId) {
      ApiConnector.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse) );
    },
    createEntry: function() {
      this.isEntryCreating = true;
      this.orderEntryId = "";
      this.dishEntryId = "";
    },
    editEntry: function(orderEntryId, dishEntryId) {
      this.isEntryEdited = true;
      this.orderEntryId = orderEntryId;
      this.dishEntryId = dishEntryId;
    },
    cancelEdit: function() {
      this.isEntryCreating = false;
      this.isEntryEdited = false;
      this.orderEntryId = "";
      this.dishEntryId = "";
    },
    userColumnRowSpan: function(order, orderEntry) {
      if ((this.isOrderEntryOwner(orderEntry) || this.isOrderOwner(order)) && this.isEntryEdited == false) {
        return orderEntry.dishEntries.length + 2;
      } else {
        return orderEntry.dishEntries.length + 1;
      }
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading;
    },
    numberOfCurrentUserEntries () {
      return this.orderEntries.filter(e => e.user.id == this.currentUserId).length;
    },
    username: function() {
      return this.$store.state.username;
    }
  },
  components: {
    BackButton,
    Price,
    Spinner,
    OrderStateButtons,
    OrderEntryCreateEntry,
    OrderEntryEditEntry,
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

  .allowed {
    color: green;
  }

  .not-allowed {
    color: red;
  }

  .price-column {
    min-width: 94px;
  }

  .names-person {
    width: 250px;
  }

  .actions-column {
    width: 108px;
  }

  p.dish-name {
    margin-top: 0;
    margin-bottom: 0;
  }

  p.side-dish-name {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 10pt;
    color: #555555;
  }

  p.dish-comments {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 10pt;
    color: #444444;
  }
</style>
