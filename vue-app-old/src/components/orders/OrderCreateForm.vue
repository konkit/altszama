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

        <order-form :order="order" :restaurantsList="restaurantsList" @orderUpdate="order => { this.order = order }" />

        <div class="row justify-content-center">
          <div class="col">
            <button class="btn btn-block btn-success" v-on:click="submitForm">Create</button>
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
import OrderForm from './components/OrderForm.vue'

import Spinner from '../commons/spinner.vue'
import ApiConnector from '../../ApiConnector.js'

export default {
  name: 'order-create-form',
  data () {
    return {
      order: {},
      restaurantsList: []
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/orders/create.json")
      .then(response => {
        this.restaurantsList = response.data.restaurantsList;

        var restaurantId;
        if( response.data.restaurant != null) {
          restaurantId = response.data.restaurant.id
        } else {
          restaurantId = response.data.restaurantsList[0].id;
        }

        this.order = {
          restaurantId: restaurantId,
          orderDate: response.data.orderDate,
          timeOfOrder: response.data.timeOfOrder,

          decreaseInPercent: 0,
          deliveryCostPerEverybody: 0,
          deliveryCostPerDish: 0,
          paymentByCash: true,
          paymentByBankTransfer: false,
          bankTransferNumber: ''
        }

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();

      let formData = {
        restaurantId: this.order.restaurantId,
        orderDate: this.order.orderDate,
        timeOfOrder: this.order.timeOfOrder,
        decreaseInPercent: this.order.decreaseInPercent,
        deliveryCostPerEverybody: Math.round(this.order.deliveryCostPerEverybody * 100),
        deliveryCostPerDish: Math.round(this.order.deliveryCostPerDish * 100),
        paymentByCash: this.order.paymentByCash === true,
        paymentByBankTransfer: this.order.paymentByBankTransfer === true,
        bankTransferNumber: this.order.bankTransferNumber
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
    Spinner,
    OrderForm
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