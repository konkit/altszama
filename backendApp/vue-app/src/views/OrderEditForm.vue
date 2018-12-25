<template>
  <WithSpinner>
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

      <errors-component ref="errorsComponent"/>

      <order-form :order="order" :restaurantsList="restaurantsList"/>

      <div class="row justify-content-center">
        <div class="col">
          <button class="btn btn-block btn-success" v-on:click="submitForm">Update</button>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import BackButton from '../components/commons/backButton.vue'
  import ErrorsComponent from '../components/commons/errors.vue'
  import MaskedInput from 'vue-text-mask'
  import Spinner from '../components/commons/spinner.vue'
  import ApiConnector from '../lib/ApiConnector.js'
  import OrderForm from '../components/orders/OrderForm.vue'
  import WithSpinner from "../components/commons/WithSpinner";
  import OrdersApiConnector from "../lib/OrdersApiConnector";

  export default {
    name: 'order-edit-form',
    data() {
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
      OrdersApiConnector.getOrderEditData(this.orderId)
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

        let dataSuccessUrl = "#/orders/show/" + this.orderId;

        let errorsComponent = this.$refs.errorsComponent;

        OrdersApiConnector.editOrder(this.orderId, this.order)
          .then(response => {
            window.location.href = dataSuccessUrl;
          })
          .catch(error => {
            console.log("orderEditForm Error:");
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