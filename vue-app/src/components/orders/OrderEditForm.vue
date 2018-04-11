<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button :href="'#/orders/show/' + orderId"></back-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Edit order</h1>
          </div>
        </div>

        <errors-component ref="errorsComponent" />

        <order-form :order="order" :restaurantsList="restaurantsList" />

        <div class="row justify-content-center">
          <div class="col">
            <button class="btn btn-block btn-success" v-on:click="submitForm">Update</button>
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
import Spinner from '../commons/spinner.vue'
import ApiConnector from '../../ApiConnector.js'

export default {
  name: 'order-edit-form',
  data () {
    return {
      orderId: this.$route.params.id,

      order: {},
      restaurantsList: [],
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/orders/" + this.orderId + "/edit.json")
      .then(response => {
        this.restaurantsList = response.data.restaurantsList;

        var restaurantId;
        if( response.data.order.restaurant != null) {
          restaurantId = response.data.order.restaurant.id
        } else {
          restaurantId = response.data.restaurantsList[0].id;
        }

        this.order = {
          restaurantId: restaurantId,
          orderDate: response.data.order.orderDate,
          timeOfOrder: response.data.order.timeOfOrder,
          decreaseInPercent: response.data.order.decreaseInPercent,
          deliveryCostPerEverybody: response.data.order.deliveryCostPerEverybody / 100,
          deliveryCostPerDish: response.data.order.deliveryCostPerDish / 100,
          paymentByCash: response.data.order.paymentByCash,
          paymentByBankTransfer: response.data.order.paymentByBankTransfer,
          bankTransferNumber: response.data.order.bankTransferNumber
        }

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();

      let formData = {
        orderId: this.orderId,
        restaurantId: this.order.restaurantId,
        orderDate: this.order.orderDate,
        timeOfOrder: this.order.timeOfOrder,
        decreaseInPercent: this.order.decreaseInPercent,
        deliveryCostPerEverybody: Math.round(this.order.deliveryCostPerEverybody * 100),
        deliveryCostPerDish: Math.round(this.order.deliveryCostPerDish * 100),
        paymentByCash: this.order.paymentByCash === true,
        paymentByBankTransfer: this.order.paymentByBankTransfer === true,
        bankTransferNumber: this.order.bankTransferNumber,
      };

      let action = "/orders/update";
      let dataSuccessUrl = "#/orders/show/" + this.orderId;

      let errorsComponent = this.$refs.errorsComponent;

      ApiConnector.makePost(action, formData)
        .then(function (response) {
          window.location.href = dataSuccessUrl;
        })
        .catch(function(error) {
          console.log("orderEditForm Error:");
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