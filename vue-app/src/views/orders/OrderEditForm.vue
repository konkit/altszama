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


        <div class="container">
          <errors-component/>

          <form>
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
                      id="decreaseInPercent"
                      currency="%"
                      :min="0"
                      :max="100"
                      currency-symbol-position="suffix"
                      decimal-precision="false"
                      class="form-control"
                      :value="decreaseInPercent"
                      @input.native="updateDecreaseInPercent($event)"
                  />
                </div>

                <div class="form-group">
                  <label for="deliveryCostPerEverybody">Delivery cost (total)</label>
                  <vue-numeric
                      id="deliveryCostPerEverybody"
                      currency="zł"
                      separator="."
                      currency-symbol-position="suffix"
                      :precision="2"
                      class="form-control"
                      required=""
                      :value="deliveryCostPerEverybody"
                      @input.native="updateDeliveryCostPerEverybody($event)"
                  >
                  </vue-numeric>
                </div>

                <div class="form-group">
                  <label for="deliveryCostPerDish">Delivery cost (per dish)</label>
                  <vue-numeric
                      id="deliveryCostPerDish"
                      currency="zł"
                      separator="."
                      currency-symbol-position="suffix"
                      :precision="2"
                      class="form-control"
                      required=""
                      :value="deliveryCostPerDish"
                      @input.native="updateDeliveryCostPerDish($event)"
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
                  <label for="bankTransferNumber">Bank transfer number</label>
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
              <v-btn color="success" block @click="submitForm">
                Update
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
</style>