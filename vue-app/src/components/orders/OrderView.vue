<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="loadedAndStateIsOrdering()">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button v-bind:href="'#/orders/show/' + order.id"></back-button>
          </div>
        </div>
        
        <div class="row justify-content-center">
          <div class="col">
            <h1>Ordering from {{order.restaurant.name}}</h1>

            <div class="alert alert-warning">
              <p>Order is now locked, so no one should order anything else now.</p>

              <!-- <h4>Below there are all entries you have to order.</h4> -->
            </div>

            <h4>Now please call:</h4>
            <h4>tel. {{order.restaurant.telephone}}</h4>
            <h4>make an order and then enter approximate delivery time and click "Order placed"</h4>
            
          </div>
        </div>
      </div>
      
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">

            <form id="place-order-form">
              <div class="form-group">
                <masked-input class="form-control" type="text" v-model="approxTimeOfDelivery" :mask="[/\d/,/\d/,':',/\d/,/\d/]" :keepCharPositions="true" />
              </div>
            </form>

            <button class="btn btn-block btn-success" v-on:click="submitForm">
              Order placed!
              &nbsp;<i class="fa fa-arrow-right" aria-hidden="true"/>
            </button>
            
          </div>
        </div>
      </div>

      <div class="container">
        <errors-component ref="errorsComponent" />
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">

            <h4>Dishes:</h4> 

            <table class="table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Eaters (and their comments)</th>
                  <th class="price-column">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in this.groupedEntries" v-bind:key="entry.id">
                  <td>{{entry.eatingPeopleCount}}x {{entry.dish.name}} (<price :data-price="entry.dish.price"></price>)</td>
                  
                  <td>
                    <div v-for="(eatingPersonEntry, i) in entry.eatingPeopleEntries" :key="i">
                      <p class="dish-name">
                        {{ eatingPersonEntry.user.username }}
                      </p>

                      <p class="side-dish-name" v-for="(sd, i) in eatingPersonEntry.sideDishes" :key="i">
                        + {{sd.name}} (<price :data-price="sd.price" />)
                      </p>

                      <p class="dish-comments" v-if="eatingPersonEntry.comments.length > 0">
                        Additional comments: {{ eatingPersonEntry.comments }}
                      </p>
                    </div>
                  </td>
                  <td><price v-bind:data-price="entry.price"></price></td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">

            <h4>Price summary</h4>
            
            <dt v-if="order.decreaseInPercent != 0 || order.deliveryCostPerEverybody != 0">
              Base price :
            </dt>
            <dd v-if="order.decreaseInPercent != 0 || order.deliveryCostPerEverybody != 0">
              <price :data-price="this.basePriceSum" />
            </dd>

            <dt v-if="order.decreaseInPercent != 0">
              Price decrease : 
            </dt>
            <dd v-if="order.decreaseInPercent != 0">
              - {{order.decreaseInPercent}} %
            </dd>

            <dt v-if="order.deliveryCostPerEverybody != 0">
              Delivery :
            </dt>
            <dd v-if="order.deliveryCostPerEverybody != 0">
              + <price v-bind:data-price="order.deliveryCostPerEverybody" />
            </dd>

            <dt v-if="order.deliveryCostPerDish != 0">
              Delivery per dish:
            </dt>
            <dd v-if="order.deliveryCostPerDish != 0">
              + <price v-bind:data-price="order.deliveryCostPerDish" /> * {{this.allEatingPeopleCount}}
            </dd>

            <dt>Total:</dt>
            <dd><b><price v-bind:data-price="this.totalPrice" /></b></dd>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loadedAndStateIsNotOrdering()">
      <navigation user-name="Tmp name"></navigation>

      <div class="container">
        <back-button v-bind:href="'#/orders/show/' + order.id"></back-button>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Ordering from {{order.restaurant.name}}</h1>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <h4>Sorry, the order is empty</h4>
            <p><back-button v-bind:href="'#/orders/show/' + order.id"></back-button></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import BackButton from '../commons/backButton.vue'
import ErrorsComponent from '../commons/errors.vue'
import MaskedInput from 'vue-text-mask'
import Price from '../commons/priceElement.vue'

import Spinner from '../commons/spinner.vue'
import Navigation from '../Navigation.vue'

import ApiConnector from '../../ApiConnector.js'

export default {
  data () {
    return {
      orderId: this.$route.params.id,

      results: {},
      order: '',
      groupedEntries: [],
      allEatingPeopleCount: 0,
      basePriceSum: 0,
      totalPrice: 0,
      approxTimeOfDelivery: "12:00",
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/orders/" + this.orderId + "/order_view.json")
      .then(response => {
        this.results = response.data;
        this.order = response.data.order;
        this.groupedEntries = response.data.groupedEntries;
        this.allEatingPeopleCount = response.data.allEatingPeopleCount;
        this.basePriceSum = response.data.basePriceSum;
        this.totalPrice = response.data.totalPrice;

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function() {
      let action = '/orders/' + this.orderId + '/set_as_ordered';
      let dataSuccessUrl = '#/orders/show/' + this.orderId;

      let formData = {
          approxTimeOfDelivery: this.approxTimeOfDelivery.toString()
      };

      let errorsComponent = this.$refs.errorsComponent;

      ApiConnector.makePost(action, formData)
        .then(function (response) {
            window.location.href = dataSuccessUrl;
        })
        .catch(function(error) {
            console.log("orderView Error:");
            console.log(error);
            errorsComponent.addError(error.body.message);
        });

      return false
    },
    loadedAndStateIsOrdering: function() {
      return this.loading === false && this.order.orderState === 'ORDERING';
    },
    loadedAndStateIsNotOrdering: function() {
      return this.loading === false && this.order.orderState !== 'ORDERING';
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading;
    }
  },
  components: {
    BackButton,
    ErrorsComponent,
    MaskedInput,
    Price,
    Navigation,
    Spinner
  }
}

</script>

<style scoped>
  .container {
    max-width: 1000px;
    margin-bottom: 2rem;
  }

  .price-column {
    min-width: 100px;
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