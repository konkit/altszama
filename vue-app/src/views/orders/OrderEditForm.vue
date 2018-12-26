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

      <form>
        <div class="row justify-content-center">
          <div class="col">
            <div class="form-group">
              <label for="restaurant">Restaurant: </label>

              <v-select
                  :options="this.restaurantsList"
                  label="name"
                  :value="this.restaurantsList.find(r => restaurantId == r.id)"
                  @input="updateRestaurantId($event.id)"
              >
              </v-select>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-4">
            <h3>Order time</h3>

            <div class="form-group">
              <label for="orderDate">Order date</label>
              <input
                  type="date"
                  id="orderDate"
                  name="orderDate"
                  class="form-control"
                  :value="orderDate"
                  @input="updateOrderDate($event.target.value)"
              />
            </div>

            <div class="form-group">
              <label for="timeOfOrder">Time of order</label>
              <masked-input
                  type="text"
                  class="form-control"
                  :mask="[/\d/,/\d/,':',/\d/,/\d/]"
                  :keepCharPositions="true"
                  :value="timeOfOrder"
                  @input="updateTimeOfOrder($event)"
              />
            </div>
          </div>

          <div class="col-4">
            <h3>Price change</h3>

            <div class="form-group">
              <label for="decreaseInPercent">Price decrease (in percent)</label>
              <vue-numeric
                  currency="%"
                  :min="0"
                  :max="100"
                  currency-symbol-position="suffix"
                  decimal-precision="false"
                  id="decreaseInPercent"
                  class="form-control"
                  :value="decreaseInPercent"
                  @input="updateDecreaseInPercent($event)"
              />
            </div>

            <div class="form-group">
              <label for="deliveryCostPerEverybody">Delivery cost (total)</label>
              <vue-numeric
                  currency="zł"
                  separator="."
                  currency-symbol-position="suffix"
                  :precision="2"
                  class="form-control"
                  required=""
                  id="deliveryCostPerEverybody"
                  :value="deliveryCostPerEverybody"
                  @input="updateDeliveryCostPerEverybody($event)"
              >
              </vue-numeric>
            </div>

            <div class="form-group">
              <label for="deliveryCostPerDish">Delivery cost (per dish)</label>
              <vue-numeric
                  currency="zł"
                  separator="."
                  currency-symbol-position="suffix"
                  :precision="2"
                  class="form-control"
                  required=""
                  id="deliveryCostPerDish"
                  :value="deliveryCostPerDish"
                  @input="updateDeliveryCostPerDish($event)"
              >
              </vue-numeric>
            </div>
          </div>

          <div class="col-4">
            <h3>Payment</h3>

            <b-form-group label="Payment by cash">
              <b-form-radio-group
                  buttons
                  button-variant="outline-primary"
                  :options="yesNoOptions"
                  v-model="paymentByCash"
              />
            </b-form-group>

            <b-form-group label="Payment by bank transfer">
              <b-form-radio-group
                  buttons
                  button-variant="outline-primary"
                  :options="yesNoOptions"
                  v-model="paymentByBankTransfer"
              />
            </b-form-group>

            <div class="form-group" v-if="paymentByBankTransfer">
              <label>Bank transfer number</label>
              <input
                  type="text"
                  id="bankTransferNumber"
                  name="bankTransferNumber"
                  class="form-control"
                  :value="bankTransferNumber"
                  @change="updateBankTransferNumber($event)"
              />
            </div>
          </div>
        </div>
      </form>

      <div class="row justify-content-center">
        <div class="col">
          <button class="btn btn-block btn-success" v-on:click="submitForm">Update</button>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'
  import MaskedInput from 'vue-text-mask'
  import OrderForm from '../../components/orders/OrderForm'
  import Spinner from '../../components/commons/Spinner'
  import ApiConnector from '../../lib/ApiConnector'
  import WithSpinner from "../../components/commons/WithSpinner";
  import OrdersApiConnector from "../../lib/OrdersApiConnector";
  import VueSelect from 'vue-select'


  export default {
    name: 'order-edit-form',
    data() {
      return {
        orderId: this.$route.params.id,

        yesNoOptions: [
          {text: 'Yes', value: true},
          {text: 'No', value: false},
        ]
      }
    },
    mounted() {
      OrdersApiConnector.getOrderEditData(this.orderId)
        .then(response => {
          // this.restaurantsList = response.restaurantsList;
          // this.order = response.order;

          this.$store.commit('editOrder/initData', response);
          this.$store.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    methods: {
      submitForm: function (e) {
        e.preventDefault();

        let errorsComponent = this.$refs.errorsComponent;

        const order = {
          restaurantId: this.restaurantId,
          orderId: this.orderId,
          orderDate: this.orderDate,
          timeOfOrder: this.timeOfOrder,
          decreaseInPercent: this.decreaseInPercent,
          deliveryCostPerEverybody: this.deliveryCostPerEverybody,
          deliveryCostPerDish: this.deliveryCostPerDish,
          paymentByCash: this.paymentByCash,
          paymentByBankTransfer: this.paymentByBankTransfer,
          bankTransferNumber: this.bankTransferNumber,
        };

        OrdersApiConnector.editOrder(this.orderId, order)
          .catch(error => error.body.messages.forEach(msg => errorsComponent.addError(msg)));

        return false;
      },
      updateRestaurantId(newValue) {
        this.$store.commit('editOrder/updateRestaurantId', newValue);
      },
      updateOrderDate(newOrderDate) {
        this.$store.commit('editOrder/updateOrderDate', newOrderDate);
      },
      updateTimeOfOrder(newTimeOfOrder) {
        console.log("updateTimeOfOrder", newTimeOfOrder);
        this.$store.commit('editOrder/updateTimeOfOrder', newTimeOfOrder);
      },
      updateDecreaseInPercent(newValue) {
        console.log("updateDecreaseInPercent", newValue);
        this.$store.commit('editOrder/updateDecreaseInPercent', newValue);
      },
      updateDeliveryCostPerEverybody(newValue) {
        console.log("updateDeliveryCostPerEverybody", newValue);
        this.$store.commit('editOrder/updateDeliveryCostPerEverybody', newValue);
      },
      updateDeliveryCostPerDish(newValue) {
        console.log("updateDeliveryCostPerDish", newValue);
        this.$store.commit('editOrder/updateDeliveryCostPerDish', newValue);
      },
      updatePaymentByCash(newValue) {
        console.log("updatePaymentByCash", newValue);
        this.$store.commit('editOrder/updatePaymentByCash', newValue);
      },
      updatePaymentByBankTransfer(newValue) {
        console.log("updatePaymentByBankTransfer", newValue);
        this.$store.commit('editOrder/updatePaymentByBankTransfer', newValue);
      },
      updateBankTransferNumber(newValue) {
        console.log("updateBankTransferNumber", newValue);
        this.$store.commit('editOrder/updateBankTransferNumber', newValue);
      },
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
      restaurantsList() {
        return this.$store.state.editOrder.restaurantsList;
      },

      restaurantId() {
        return this.$store.state.editOrder.restaurantId;
      },
      orderDate() {
        return this.$store.state.editOrder.orderDate;
      },
      timeOfOrder() {
        return this.$store.state.editOrder.timeOfOrder;
      },
      decreaseInPercent() {
        return this.$store.state.editOrder.decreaseInPercent;
      },
      deliveryCostPerEverybody() {
        return this.$store.state.editOrder.deliveryCostPerEverybody;
      },
      deliveryCostPerDish() {
        return this.$store.state.editOrder.deliveryCostPerDish;
      },
      paymentByCash: {
        get () {
          return this.$store.state.editOrder.paymentByCash;
        },
        set (newValue) {
          this.updatePaymentByCash(newValue)
        }
      },
      paymentByBankTransfer: {
        get () {
          return this.$store.state.editOrder.paymentByBankTransfer;
        },
        set (newValue) {
          this.updatePaymentByBankTransfer(newValue)
        }
      },
      bankTransferNumber() {
        return this.$store.state.editOrder.bankTransferNumber;
      }
    },
    components: {
      WithSpinner,
      BackButton,
      ErrorsComponent,
      MaskedInput,
      Spinner,
      OrderForm,
      'v-select': VueSelect
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