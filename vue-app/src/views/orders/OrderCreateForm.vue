<template>
  <ViewWrapper title="Create new order" backpath="#/orders">
    <LoadingView>
      <v-container>
        <errors-component/>

        <v-row>
          <v-col cols="12">
            <v-card v-if="this.restaurantsList.length === 0">
              <v-card-text>
                <p>There are no restaurants, please create one first</p>
              </v-card-text>
            </v-card>

            <v-card v-if="this.restaurantsList.length > 0">
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-autocomplete
                        :items="restaurantsList"
                        item-text="name"
                        item-value="id"
                        label="Restaurant"
                        :value="this.restaurantsList.find(r => restaurantId == r.id)"
                        @input="updateRestaurantId($event)"
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="4">
                    <h3>Order time</h3>
                    <TimePicker :value="timeOfOrder" @input="updateTimeOfOrder($event)" label="Order time"></TimePicker>
                  </v-col>

                  <v-col cols="4">
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

                  <v-col cols="4">
                    <h3>Payment</h3>

                    <v-switch v-model="paymentByCash" label="Payment by cash"></v-switch>

                    <v-switch v-model="paymentByBankTransfer" label="Payment by bank transfer"></v-switch>

                    <v-text-field
                        v-if="paymentByBankTransfer"
                        label="Bank transfer number"
                        :value="bankTransferNumber"
                        @change="updateBankTransferNumber($event)">
                    </v-text-field>

                    <v-switch v-model="paymentByBlik" label="Payment by BLIK"></v-switch>

                    <v-text-field
                        v-if="paymentByBlik"
                        label="BLIK phone number"
                        :value="blikPhoneNumber"
                        @change="updateBlikPhoneNumber($event)">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-btn color="success" block @click="submitForm">
                      Create
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

<script lang="ts">
  import ErrorsComponent from '../commons/Errors'
  import LoadingView from "../commons/LoadingView";
  import {
    INIT_CREATE_ORDER_ACTION,
    SAVE_ORDER_ACTION,
    UPDATE_BANK_TRANSFER_NUMBER,
    UPDATE_BLIK_PHONE_NUMBER,
    UPDATE_DECREASE_IN_PERCENT,
    UPDATE_DELIVERY_COST_PER_DISH,
    UPDATE_DELIVERY_COST_PER_EVERYBODY,
    UPDATE_ORDER_DATE,
    UPDATE_PAYMENT_BY_BANK_TRANSFER,
    UPDATE_PAYMENT_BY_BLIK,
    UPDATE_PAYMENT_BY_CASH,
    UPDATE_RESTAURANT_ID,
    UPDATE_TIME_OF_ORDER,
  } from "../../store/modules/CreateOrderState";
  import {mapState} from "vuex"
  import {
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../store/modules/ModifyOrderEntryState";
  import MoneyInput from "../commons/MoneyInput";
  import TimePicker from "../commons/TimePicker";
  import ViewWrapper from "../commons/ViewWrapper";
  import Vue from "vue";
  import Component from "vue-class-component";


  @Component({
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
      ViewWrapper,
      TimePicker,
      MoneyInput,
      LoadingView,
      ErrorsComponent,
    }
  })
  export default class OrderCreateForm extends Vue {
    yesNoOptions = [
      {text: 'Yes', value: true},
      {text: 'No', value: false},
    ];

    created() {
      this.$store.commit('setLoadingTrue')
    }

    mounted() {
      this.$store.dispatch(`createOrder/${INIT_CREATE_ORDER_ACTION}`);
    }

    updateRestaurantId(newValue) {
      this.$store.commit(`createOrder/${UPDATE_RESTAURANT_ID}`, newValue);
    }

    updateOrderDate(newOrderDate) {
      this.$store.commit(`createOrder/${UPDATE_ORDER_DATE}`, newOrderDate);
    }

    updateTimeOfOrder(newTimeOfOrder) {
      this.$store.commit(`createOrder/${UPDATE_TIME_OF_ORDER}`, newTimeOfOrder);
    }

    updateDecreaseInPercent(newValue) {
      this.$store.commit(`createOrder/${UPDATE_DECREASE_IN_PERCENT}`, newValue);
    }

    updateDeliveryCostPerEverybody(newValue) {
      this.$store.commit(`createOrder/${UPDATE_DELIVERY_COST_PER_EVERYBODY}`, newValue);
    }

    updateDeliveryCostPerDish(newValue) {
      this.$store.commit(`createOrder/${UPDATE_DELIVERY_COST_PER_DISH}`, newValue);
    }

    updatePaymentByCash(newValue) {
      this.$store.commit(`createOrder/${UPDATE_PAYMENT_BY_CASH}`, newValue);
    }

    updatePaymentByBankTransfer(newValue) {
      this.$store.commit(`createOrder/${UPDATE_PAYMENT_BY_BANK_TRANSFER}`, newValue);
    }

    updateBankTransferNumber(newValue) {
      this.$store.commit(`createOrder/${UPDATE_BANK_TRANSFER_NUMBER}`, newValue);
    }

    updatePaymentByBlik(newValue) {
      this.$store.commit(`createOrder/${UPDATE_PAYMENT_BY_BLIK}`, newValue);
    }

    updateBlikPhoneNumber(newValue) {
      this.$store.commit(`createOrder/${UPDATE_BLIK_PHONE_NUMBER}`, newValue);
    }

    submitForm(e) {
      e.preventDefault();
      this.$store.dispatch(`createOrder/${SAVE_ORDER_ACTION}`);

      return false;
    }

    cancelEdit() {
      this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
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