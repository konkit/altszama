<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 href="#/orders"></back-button2>

      <v-toolbar-title>
        Create new order
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <simple-card>
        <div v-if="this.restaurantsList.length === 0">
          <p>There are no restaurants, please create one first</p>
        </div>

        <div v-if="this.restaurantsList.length > 0">
            <errors-component/>

            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-autocomplete
                      :items="restaurantsList"
                      item-text="name"
                      item-value="id"
                      label="Restaurant"
                      :value="this.restaurantsList.find(r => restaurantId == r.id)"
                      @input="updateRestaurantId($event)"
                  >
                  </v-autocomplete>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs5>
                  <h3>Order time</h3>

                  <v-time-picker :value="timeOfOrder"
                                 @input="updateTimeOfOrder($event)"
                                 format="24hr"
                  ></v-time-picker>
                </v-flex>

                <v-flex xs4>
                  <h3>Price change</h3>

                  <v-text-field
                      class="percent-input"
                      label="Price decrease (in percent)"
                      suffix="%"
                      :value="decreaseInPercent"
                      @input="updateDecreaseInPercent($event)"></v-text-field>

                  <MoneyInput
                      class="short-input"
                      label="Delivery cost (total)"
                      :value="deliveryCostPerEverybody"
                      @input="updateDeliveryCostPerEverybody($event)">
                  </MoneyInput>

                  <MoneyInput
                      class="short-input"
                      label="Delivery cost (per dish)"
                      :value="deliveryCostPerDish"
                      @input="updateDeliveryCostPerDish($event)">
                  </MoneyInput>
                </v-flex>

                <v-flex xs3>
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
                        @change="updateBankTransferNumber($event.target.value)"
                    />
                  </div>

                  <b-form-group label="Payment by BLIK">
                    <b-form-radio-group
                        buttons
                        button-variant="outline-primary"
                        :options="yesNoOptions"
                        v-model="paymentByBlik"
                    >
                    </b-form-radio-group>
                  </b-form-group>

                  <div class="form-group" v-if="paymentByBlik">
                    <label>BLIK phone number</label>
                    <input
                        type="text"
                        id="blikPhoneNumber"
                        name="bankTransferNumber"
                        class="form-control"
                        :value="blikPhoneNumber"
                        @change="updateBlikPhoneNumber($event.target.value)"
                    />
                  </div>
                </v-flex>
              </v-layout>
            </v-container>

            <div class="row justify-content-center">
              <div class="col">
                <v-btn color="success" block @click="submitForm">
                  Create
                </v-btn>
              </div>
            </div>
        </div>

      </simple-card>
    </v-content>
  </LoadingView>
</template>

<script>
    import BackButton2 from '../../components/commons/BackButton2'
    import ErrorsComponent from '../../components/commons/Errors'
    import MaskedInput from 'vue-text-mask'
    import LoadingView from "../../components/commons/LoadingView";
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
        SAVE_ORDER_ACTION, UPDATE_BLIK_PHONE_NUMBER, UPDATE_PAYMENT_BY_BLIK,

    } from "../../store/modules/CreateOrderState";
    import {mapState} from "vuex"
    import SimpleCard from "../../components/commons/SimpleCard";
    import {
        CANCEL_DISH_ENTRY_MODIFICATION,
        NAMESPACE_MODIFY_ORDER_ENTRY
    } from "../../store/modules/ModifyOrderEntryState";
    import MoneyInput from "../../components/commons/MoneyInput";

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
            updatePaymentByBlik(newValue) {
                this.$store.commit(`createOrder/${UPDATE_PAYMENT_BY_BLIK}`, newValue);
            },
            updateBlikPhoneNumber(newValue) {
                this.$store.commit(`createOrder/${UPDATE_BLIK_PHONE_NUMBER}`, newValue);
            },
            submitForm(e) {
                e.preventDefault();
                this.$store.dispatch(`createOrder/${SAVE_ORDER_ACTION}`);

                return false;
            },
            cancelEdit() {
                this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
            },
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
                "blikPhoneNumber"
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
            paymentByBlik: {
                get() {
                    return this.$store.state.createOrder.paymentByBlik;
                },
                set(newValue) {
                    this.updatePaymentByBlik(newValue)
                }
            },
        },
        components: {
            MoneyInput,
            SimpleCard,
            LoadingView,
            BackButton2,
            ErrorsComponent,
            MaskedInput,
            'v-select': VueSelect
        }
    }
</script>

<style scoped>
  .row {
    margin-top: 2rem;
  }

  .percent-input {
    width: 150px;
  }

  .short-input {
    width: 200px;
  }

</style>