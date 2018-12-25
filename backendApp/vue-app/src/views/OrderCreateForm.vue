<template>
  <WithSpinner>
    <div v-if="this.restaurantsList.length === 0">
      <p>There are no restaurants, please create one first</p>
    </div>

    <div v-if="this.restaurantsList.length > 0">
      <div class="container">
        <back-button href="#/orders"></back-button>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Create new order</h1>
          </div>
        </div>

        <errors-component ref="errorsComponent"/>

        <order-form :order="order" :restaurantsList="restaurantsList" @orderUpdate="order => { this.order = order }"/>

        <div class="row justify-content-center">
          <div class="col">
            <button class="btn btn-block btn-success" v-on:click="submitForm">Create</button>
          </div>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import BackButton from '../components/commons/backButton.vue'
  import ErrorsComponent from '../components/commons/errors.vue'
  import MaskedInput from 'vue-text-mask'
  import OrderForm from '../components/orders/OrderForm.vue'
  import Spinner from '../components/commons/spinner.vue'
  import ApiConnector from '../lib/ApiConnector.js'
  import WithSpinner from "../components/commons/WithSpinner";
  import OrdersApiConnector from "../lib/OrdersApiConnector";

  export default {
    name: 'order-create-form',
    data() {
      return {
        order: {},
        restaurantsList: []
      }
    },
    created() {
      this.$store.commit('setLoadingTrue')
    },
    mounted() {
      OrdersApiConnector.getOrderCreateData()
        .then(response => {
          this.restaurantsList = response.restaurantsList;
          this.order = response.order;

          this.$store.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    methods: {
      submitForm: function (e) {
        e.preventDefault();

        let dataSuccessUrl = "#/orders/";

        let errorsComponent = this.$refs.errorsComponent;

        OrdersApiConnector.createOrder(order, this.token)
          .then(response => {
            window.location.href = dataSuccessUrl;
          })
          .catch(error => {
            console.log("orderCreateForm Error:");
            console.log(error);
            error.body.messages.forEach(msg => errorsComponent.addError(msg));
          });

        return false;
      }
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      }
    },
    components: {
      WithSpinner,
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