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

        <errors-component />

        <form>
          <div class="row justify-content-center">
            <div class="col">
              <div class="form-group">
                <label for="restaurant">Restaurant: </label>

                <v-select
                    id="restaurant"
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
                    id="timeOfOrder"
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
                >
                </b-form-radio-group>
              </b-form-group>

              <b-form-group label="Payment by bank transfer">
                <b-form-radio-group
                    buttons
                    button-variant="outline-primary"
                    :options="yesNoOptions"
                    v-model="paymentByBankTransfer"
                >
                </b-form-radio-group>
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
            <button class="btn btn-block btn-success" @click="submitForm">Create</button>
          </div>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'
  import MaskedInput from 'vue-text-mask'
  import WithSpinner from "../../components/commons/WithSpinner";
  import VueSelect from 'vue-select'
  import {
    INIT_CREATE_ORDER_ACTION,
    UPDATE_BANK_TRANSFER_NUMBER,
    UPDATE_PAYMENT_BY_BANK_TRANSFER,
    UPDATE_PAYMENT_BY_CASH,
    UPDATE_DELIVERY_COST_PER_DISH,
    UPDATE_DELIVERY_COST_PER_EVERYBODY,
    UPDATE_DECREASE_IN_PERCENT,
    UPDATE_TIME_OF_ORDER,
    UPDATE_ORDER_DATE,
    UPDATE_RESTAURANT_ID,
    SAVE_ORDER_ACTION,

  } from "../../store/modules/CreateOrderState";
  import {mapState} from "vuex"

  export default {
    name: 'order-create-form',
    data() {
      return {
        yesNoOptions: [
          {text: 'Yes', value: true},
          {text: 'No', value: false},
        ]
      }
    },
    created() {
      this.$store.commit('setLoadingTrue')
    },
    mounted() {
      this.$store.dispatch(`createOrder/${INIT_CREATE_ORDER_ACTION}`);
    },
    methods: {
      updateRestaurantId(newValue) {
        this.$store.commit(`createOrder/${UPDATE_RESTAURANT_ID}`, newValue);
      },
      updateOrderDate(newOrderDate) {
        this.$store.commit(`createOrder/${UPDATE_ORDER_DATE}`, newOrderDate);
      },
      updateTimeOfOrder(newTimeOfOrder) {
        this.$store.commit(`createOrder/${UPDATE_TIME_OF_ORDER}`, newTimeOfOrder);
      },
      updateDecreaseInPercent(newValue) {
        this.$store.commit(`createOrder/${UPDATE_DECREASE_IN_PERCENT}`, newValue);
      },
      updateDeliveryCostPerEverybody(newValue) {
        this.$store.commit(`createOrder/${UPDATE_DELIVERY_COST_PER_EVERYBODY}`, newValue);
      },
      updateDeliveryCostPerDish(newValue) {
        this.$store.commit(`createOrder/${UPDATE_DELIVERY_COST_PER_DISH}`, newValue);
      },
      updatePaymentByCash(newValue) {
        this.$store.commit(`createOrder/${UPDATE_PAYMENT_BY_CASH}`, newValue);
      },
      updatePaymentByBankTransfer(newValue) {
        this.$store.commit(`createOrder/${UPDATE_PAYMENT_BY_BANK_TRANSFER}`, newValue);
      },
      updateBankTransferNumber(newValue) {
        this.$store.commit(`createOrder/${UPDATE_BANK_TRANSFER_NUMBER}`, newValue);
      },
      submitForm(e) {
        e.preventDefault();
        this.$store.dispatch(`createOrder/${SAVE_ORDER_ACTION}`);

        return false;
      }
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
      ...mapState("createOrder", [
        "restaurantsList",
        "restaurantId",
        "orderDate",
        "timeOfOrder",
        "decreaseInPercent",
        "deliveryCostPerEverybody",
        "deliveryCostPerDish",
        "bankTransferNumber",
      ]),
      paymentByCash: {
        get() {
          return this.$store.state.createOrder.paymentByCash;
        },
        set(newValue) {
          this.updatePaymentByCash(newValue)
        }
      },
      paymentByBankTransfer: {
        get() {
          return this.$store.state.createOrder.paymentByBankTransfer;
        },
        set(newValue) {
          this.updatePaymentByBankTransfer(newValue)
        }
      },
    },
    components: {
      WithSpinner,
      BackButton,
      ErrorsComponent,
      MaskedInput,
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