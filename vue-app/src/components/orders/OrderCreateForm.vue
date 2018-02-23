<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false && this.restaurantsList.length === 0" >
      <p>There are no restaurants, please create one first</p>
    </div>

    <div v-if="this.loading === false && this.restaurantsList.length > 0" >
      <div class="container">
        <back-button href="#/orders"></back-button>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Create new order</h1>
          </div>
        </div>

        <errors-component ref="errorsComponent" />

        <form>
          <div class="row justify-content-center">
            <div class="col">
              <div class="form-group">
                <label for="restaurant">Restaurant: </label>
                <select id="restaurant" class="form-control" v-model="restaurantId">
                  <option v-for="restaurant in this.restaurantsList" v-bind:key="restaurant.id" v-bind:value="restaurant.id">
                    <span>{{restaurant.name}}</span>
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-4">
              <h3>Order time</h3>

              <div class="form-group">
                <label for="orderDate">Order date</label>
                <input type="date" id="orderDate" class="form-control" v-model="orderDate" />
              </div>

              <div class="form-group">
                <label for="timeOfOrder">Time of order</label>
                <masked-input type="text" class="form-control" v-model="timeOfOrder" :mask="[/\d/,/\d/,':',/\d/,/\d/]" :keepCharPositions="true" />
              </div>
            </div>

            <div class="col-4">
              <h3>Price change</h3>

              <div class="form-group">
                <label for="decreaseInPercent">Price decrease (in percent)</label>
                <vue-numeric currency="%" :min="0" :max="100" currency-symbol-position="suffix" decimal-precision="false" id="decreaseInPercent" class="form-control" v-model="decreaseInPercent" />
              </div>

              <div class="form-group">
                <label for="deliveryCostPerEverybody">Delivery cost (total)</label>
                <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="deliveryCostPerEverybody" v-bind:precision="2" class="form-control" required="" id="deliveryCostPerEverybody"></vue-numeric>
              </div>

              <div class="form-group">
                <label for="deliveryCostPerDish">Delivery cost (per dish)</label>
                <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="deliveryCostPerDish" v-bind:precision="2" class="form-control" required="" id="deliveryCostPerDish"></vue-numeric>
              </div>
            </div>

            <div class="col-4">
              <h3>Payment</h3>

              <b-form-group label="Payment by cash">
                <b-form-radio-group
                          buttons
                          v-model="paymentByCash"
                          button-variant="outline-primary"
                          :options="yesNoOptions" />
              </b-form-group>

              <b-form-group label="Payment by bank transfer">
                <b-form-radio-group
                          buttons
                          v-model="paymentByBankTransfer"
                          button-variant="outline-primary"
                          :options="yesNoOptions" />
              </b-form-group>

              <div class="form-group" v-if="this.paymentByBankTransfer">
                <label>Bank transfer number</label>
                <input type="text" id="bankTransferNumber" class="form-control" v-model="bankTransferNumber" />
              </div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col">
              <button class="btn btn-block btn-success" v-on:click="submitForm">Create</button>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import BackButton from '../commons/backButton.vue'
import ErrorsComponent from '../commons/errors.vue'
import MaskedInput from 'vue-text-mask'

import Spinner from '../commons/spinner.vue'

import ApiConnector from '../../ApiConnector.js'

export default {
  name: 'order-create-form',
  data () {
    return {
      restaurantId: '',
      orderDate: '',
      timeOfOrder: '',
      decreaseInPercent: 0,
      deliveryCostPerEverybody: 0,
      deliveryCostPerDish: 0,
      paymentByCash: true,
      paymentByBankTransfer: false,
      bankTransferNumber: '',

      restaurantsList: [],

      yesNoOptions: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ]
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/orders/create.json")
      .then(response => {
        this.restaurantsList = response.data.restaurantsList;

        if( response.data.restaurant != null) {
          this.restaurantId = response.data.restaurant.id
        } else {
          this.restaurantId = response.data.restaurantsList[0].id;
        }
        this.orderDate = response.data.orderDate ;
        this.timeOfOrder = response.data.timeOfOrder;

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();

      let formData = {
        restaurantId: this.restaurantId,
        orderDate: this.orderDate,
        timeOfOrder: this.timeOfOrder,
        decreaseInPercent: this.decreaseInPercent,
        deliveryCostPerEverybody: Math.round(this.deliveryCostPerEverybody * 100),
        deliveryCostPerDish: Math.round(this.deliveryCostPerDish * 100),
        paymentByCash: this.paymentByCash === true,
        paymentByBankTransfer: this.paymentByBankTransfer === true,
        bankTransferNumber: this.bankTransferNumber
      };

      let action = "/orders/save";
      let dataSuccessUrl = "#/orders/";

      let errorsComponent = this.$refs.errorsComponent;

      ApiConnector.makePost(action, formData, {'headers': {'Authorization': 'Bearer ' + this.token}})
        .then(function (response) {
          window.location.href = dataSuccessUrl;
        })
        .catch(function(error) {
          console.log("orderCreateForm Error:");
          console.log(error);
          error.body.messages.forEach(msg => errorsComponent.addError(msg));
        });

      return false;
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
    Spinner
  }
}
</script>

<style scoped>
  .container {
    max-width: 900px;
  }

  .row {
    margin-top: 2rem;
  }
</style>