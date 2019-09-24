<template>
  <ViewWrapper :title="`Edit order from ${restaurantName}`" :backpath="`#/orders/show/${orderId}`">
    <LoadingView>
      <v-container>
        <errors-component/>

        <v-row>
          <v-col>
            <order-state-buttons></order-state-buttons>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col>
                    <h3>Order time</h3>
                    <TimePicker :value="timeOfOrder" @input="updateTimeOfOrder($event)" label="Order time"></TimePicker>
                  </v-col>

                  <v-col>
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
                  </v-col>

                  <v-col>
                    <h3>Payment</h3>

                    <v-switch v-model="paymentByCash" label="Payment by cash"></v-switch>

                    <v-switch v-model="paymentByBankTransfer" label="Payment by bank transfer"></v-switch>

                    <v-text-field
                        v-if="paymentByBankTransfer"
                        label="Bank transfer number"
                        :value="bankTransferNumber"
                        @change="updateBankTransferNumber($event)"
                    />

                    <v-switch v-model="paymentByBlik" label="Payment by BLIK"></v-switch>

                    <v-text-field
                        v-if="paymentByBlik"
                        label="BLIK phone number"
                        :value="blikPhoneNumber"
                        @change="updateBlikPhoneNumber($event)"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-btn color="success" block @click="submitForm">
                      Update
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script>
  import BackButton2 from '../commons/BackButton2'
  import ErrorsComponent from '../commons/Errors'
  import MaskedInput from 'vue-text-mask'
  import LoadingView from "../commons/LoadingView";
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
    UPDATE_BLIK_PHONE_NUMBER,
    UPDATE_PAYMENT_BY_BLIK
  } from "../../store/modules/EditOrderState"
  import {
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../store/modules/ModifyOrderEntryState";
  import MoneyInput from "../commons/MoneyInput";
  import TimePicker from "../commons/TimePicker";
  import OrderStateButtons from "./components/OrderStateButtons";
  import ViewWrapper from "../commons/ViewWrapper";

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
      updatePaymentByBlik(newValue) {
        this.$store.commit(`editOrder/${UPDATE_PAYMENT_BY_BLIK}`, newValue);
      },
      updateBlikPhoneNumber(newValue) {
        this.$store.commit(`editOrder/${UPDATE_BLIK_PHONE_NUMBER}`, newValue);
      },
      cancelEdit() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
      }
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
        "blikPhoneNumber"
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
      paymentByBlik: {
        get() {
          return this.$store.state.editOrder.paymentByBlik;
        },
        set(newValue) {
          this.updatePaymentByBlik(newValue)
        }
      },
    },
    components: {
      ViewWrapper,
      OrderStateButtons,
      TimePicker,
      MoneyInput,
      LoadingView,
      BackButton2,
      ErrorsComponent,
      MaskedInput,
      'v-select': VueSelect
    }
  }
</script>

<style scoped>
  .percent-input {
    width: 150px;
  }

  .short-input {
    width: 200px;
  }
</style>