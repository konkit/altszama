<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 :href="'#/orders/show/' + orderId"></back-button2>

      <v-toolbar-title>
        Edit order from {{restaurantName}}
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <simple-card>

        <errors-component/>

        <v-container grid-list-md>
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
                      @change="updateBankTransferNumber($event)"
                  />
                </div>
              </v-flex>
            </v-layout>
        </v-container>

          <div class="row justify-content-center">
            <div class="col">
              <v-btn color="success" block @click="submitForm">
                Update
              </v-btn>
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
    import {mapState} from "vuex"
    import {
        UPDATE_BANK_TRANSFER_NUMBER,
        UPDATE_PAYMENT_BY_BANK_TRANSFER,
        UPDATE_PAYMENT_BY_CASH,
        UPDATE_DELIVERY_COST_PER_DISH,
        UPDATE_DELIVERY_COST_PER_EVERYBODY,
        UPDATE_DECREASE_IN_PERCENT,
        UPDATE_TIME_OF_ORDER,
        UPDATE_ORDER_DATE,
        INIT_EDIT_ORDER_ACTION,
        UPDATE_ORDER_ACTION,
    } from "../../store/modules/EditOrderState"
    import SimpleCard from "../../components/commons/SimpleCard";
    import {
        CANCEL_DISH_ENTRY_MODIFICATION,
        NAMESPACE_MODIFY_ORDER_ENTRY
    } from "../../store/modules/ModifyOrderEntryState";
    import MoneyInput from "../../components/commons/MoneyInput";

    const yesNoOptions = [
        {text: 'Yes', value: true},
        {text: 'No', value: false},
    ];

    export default {
        name: 'order-edit-form',
        data() {
            return {
                orderId: this.$route.params.id,

                yesNoOptions: yesNoOptions,
            }
        },
        mounted() {
            this.$store.dispatch(`editOrder/${INIT_EDIT_ORDER_ACTION}`, {orderId: this.orderId})
        },
        methods: {
            submitForm(e) {
                e.preventDefault();

                this.$store.dispatch(`editOrder/${UPDATE_ORDER_ACTION}`);

                return false;
            },
            updateOrderDate(newOrderDate) {
                this.$store.commit(`editOrder/${UPDATE_ORDER_DATE}`, newOrderDate);
            },
            updateTimeOfOrder(newTimeOfOrder) {
                this.$store.commit(`editOrder/${UPDATE_TIME_OF_ORDER}`, newTimeOfOrder);
            },
            updateDecreaseInPercent(newValue) {
                this.$store.commit(`editOrder/${UPDATE_DECREASE_IN_PERCENT}`, newValue);
            },
            updateDeliveryCostPerEverybody(newValue) {
                this.$store.commit(`editOrder/${UPDATE_DELIVERY_COST_PER_EVERYBODY}`, newValue);
            },
            updateDeliveryCostPerDish(newValue) {
                this.$store.commit(`editOrder/${UPDATE_DELIVERY_COST_PER_DISH}`, newValue);
            },
            updatePaymentByCash(newValue) {
                this.$store.commit(`editOrder/${UPDATE_PAYMENT_BY_CASH}`, newValue);
            },
            updatePaymentByBankTransfer(newValue) {
                this.$store.commit(`editOrder/${UPDATE_PAYMENT_BY_BANK_TRANSFER}`, newValue);
            },
            updateBankTransferNumber(newValue) {
                this.$store.commit(`editOrder/${UPDATE_BANK_TRANSFER_NUMBER}`, newValue);
            },
            cancelEdit() {
                this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
            },
        },
        computed: {
            loading() {
                return this.$store.state.loading;
            },
            ...mapState("editOrder", [
                "restaurantName",
                "orderDate",
                "timeOfOrder",
                "decreaseInPercent",
                "deliveryCostPerEverybody",
                "deliveryCostPerDish",
                "bankTransferNumber",
            ]),
            paymentByCash: {
                get() {
                    return this.$store.state.editOrder.paymentByCash;
                },
                set(newValue) {
                    this.updatePaymentByCash(newValue)
                }
            },
            paymentByBankTransfer: {
                get() {
                    return this.$store.state.editOrder.paymentByBankTransfer;
                },
                set(newValue) {
                    this.updatePaymentByBankTransfer(newValue)
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