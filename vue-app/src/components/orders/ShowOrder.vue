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

      <div class="container">
        <div class="row justify-content-center">
          <div class="col-4">
            <h3>Order data</h3>

            <dt>Who will order?</dt>
            <dd>{{ this.order.orderCreator.username }}</dd>

            <dt>When?</dt>
            <dd>{{ this.order.timeOfOrder }}</dd>

            <dt>When it'll arrive?</dt>
            <dd>{{ this.timeOfDeliveryOrNA() }}</dd>
          </div>

          <div class="col-4">
            <h3>Price modifiers</h3>

            <dt>Price decrease</dt>
            <dd>{{ this.order.decreaseInPercent }} %</dd>

            <dt>Delivery cost (total)</dt>
            <dd><price v-bind:data-price="this.order.deliveryCostPerEverybody" /></dd>

            <dt>Delivery cost (per dish)</dt>
            <dd><price v-bind:data-price="this.order.deliveryCostPerDish" /></dd>
          </div>

          <div class="col-4">
            <h3>Payment</h3>
            
            <dt>Payment by cash</dt>
            <dd v-if="this.order.paymentByCash == true">
              <b class="allowed">
                Allowed!
                <span class="fa fa-check"></span>
              </b>
            </dd>
            <dd v-if="this.order.paymentByCash == false">
              <b class="not-allowed">
                Not allowed!
                <span class="fa fa-times"></span>
              </b>
            </dd>

            <dt>Payment by bank transfer</dt>
            <dd v-if="this.order.paymentByBankTransfer == true">
              <b class="allowed">
                Allowed!
                <span class="fa fa-check"></span>
              </b>
            </dd>
            <dd v-if="this.order.paymentByBankTransfer == false">
              <b class="not-allowed">
                Not allowed!
                <span class="fa fa-times"></span>
              </b>
            </dd>

            <dt v-if="this.order.paymentByBankTransfer">Bank transfer number</dt>
            <dd v-if="this.order.paymentByBankTransfer">{{ this.order.bankTransferNumber }}</dd>
          </div>

        </div>
      </div>
      
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <p><b>Link to menu:</b> <a target="_blank" :href="order.restaurant.url">{{this.order.restaurant.url}}</a></p>
          </div>
        </div>
      </div>

      <div class="container" v-if="isNotOrderedYet()">
        <div class="row justify-content-center">
          <div class="col">
            <a  class="btn btn-success" v-bind:href="createEntryLink(order.id)">
              I'm hungry too - add my order &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <h2>Participants:</h2>

            <table class="table">
              <tr>
                <th>Eating person</th>
                <th>Dish</th>
                <th>Base Price</th>
                <th>Final Price</th>
                <th>Additional comments</th>
                <th>Actions</th>
              </tr>
              <tr v-for="orderEntry in this.orderEntries" v-bind:key="orderEntry.id" >
                <td> {{orderEntry.user.username}} </td>
                <td> 
                  <p>{{orderEntry.dish.name}}</p>
                  <p v-for="sideDish in orderEntry.sideDishes" :key="sideDish.id">
                    + {{sideDish.name}}
                  </p> 
                </td>
                <td>
                  <p><price v-bind:data-price="orderEntry.basePrice"/></p>
                  <p v-for="sideDish in orderEntry.sideDishes" :key="sideDish.id">
                    + <price :data-price="sideDish.price" />
                  </p>
                </td>
                <td><price v-bind:data-price="orderEntry.finalPrice"/></td>
                <td>{{orderEntry.comments}}</td>
                <td>
                  <div v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">

                    <div v-if="order.orderState === 'CREATED'">
                      <button type="button" class="btn btn-light" @click="editEntry(orderEntry.id)">
                        <i class="fa fa-pencil" aria-hidden="true" />
                      </button>

                      <button type="button" class="btn btn-danger" @click="deleteEntry(orderEntry.id)">
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
            </table>
          </div>
        </div>
      </div>

      <div class="container" v-if="isOrderOwner()">
        <div class="row justify-content-center">
          <div class="col">
            <h3> Manage order </h3>
            <order-state-buttons v-bind:order-id="this.order.id" v-bind:order-state="this.order.orderState"></order-state-buttons>
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

import OrderStateButtons from './buttons/orderStateButtons.vue'

import ApiConnector from '../../ApiConnector.js'

export default {
  data () {
    return {
      orderId: this.$route.params.id,

      results: {},
      order: '',
      orderEntries: [],
      currentUserId: '',
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
    timeOfDeliveryOrNA: function() {
      if (this.order.timeOfDelivery != null) {
        return this.order.timeOfDelivery
      } else {
        return "As ASAP as possible"
      }
    },
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
    editEntry: function(orderEntryId) {
      window.location = '#/order_entries/' + orderEntryId + '/edit'
    },
    deleteEntry: function(orderEntryId) {
      ApiConnector.makeGet('/order_entries/' + orderEntryId + '/delete')
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse) );
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading;
    }
  },
  components: {
    BackButton,
    Price,
    Spinner,
    OrderStateButtons
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
</style>
