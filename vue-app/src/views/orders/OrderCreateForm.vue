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
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../store/modules/ModifyOrderEntryState";
  import MoneyInput from "../commons/MoneyInput";
  import TimePicker from "../commons/TimePicker";
  import ViewWrapper from "../commons/ViewWrapper";
  import Vue from "vue";
  import Component from "vue-class-component";
  import ApiConnector from "../../lib/ApiConnector";
  import OrdersApiConnector from "../../lib/OrdersApiConnector";


  @Component({
    computed: {
      loading() {
        return this.$store.state.loading;
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
    restaurantsList = [];

    // Order
    restaurantId = 0;
    orderDate = "";
    timeOfOrder = "";
    decreaseInPercent = "";
    deliveryCostPerEverybody = "";
    deliveryCostPerDish = "";
    paymentByCash = true;
    paymentByBankTransfer = false;
    bankTransferNumber = "";
    paymentByBlik = false;
    blikPhoneNumber = "";

    created() {
      this.$store.commit('setLoadingTrue')
    }

    mounted() {
      OrdersApiConnector.getOrderCreateData()
        .then(response => {
          this.restaurantsList = response.restaurantsList;

          this.restaurantId = response.order.restaurantId;
          this.orderDate = response.order.orderDate;
          this.timeOfOrder = response.order.timeOfOrder;
          this.decreaseInPercent = response.order.decreaseInPercent;
          this.deliveryCostPerEverybody = response.order.deliveryCostPerEverybody;
          this.deliveryCostPerDish = response.order.deliveryCostPerDish;
          this.paymentByCash = response.order.paymentByCash;
          this.paymentByBankTransfer = response.order.paymentByBankTransfer ;
          this.bankTransferNumber = response.order.bankTransferNumber;
          this.paymentByBlik = response.order.paymentByBlik ;
          this.blikPhoneNumber = response.order.blikPhoneNumber;
          
          this.$store.commit('setLoadingFalse');
          document.title = `Create new order | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }

    updateRestaurantId(newValue) {
      this.restaurantId = newValue;
    }

    updateOrderDate(newValue) {
      this.orderDate = newValue;
    }

    updateTimeOfOrder(newValue) {
      this.timeOfOrder = newValue
    }

    updateDecreaseInPercent(newValue) {
      this.decreaseInPercent = newValue;
    }

    updateDeliveryCostPerEverybody(newValue) {
      this.deliveryCostPerEverybody = newValue;
    }

    updateDeliveryCostPerDish(newValue) {
      this.deliveryCostPerDish = newValue;
    }

    updatePaymentByCash(newValue) {
      this.paymentByCash = newValue;
    }

    updatePaymentByBankTransfer(newValue) {
      this.paymentByBankTransfer = newValue;
    }

    updateBankTransferNumber(newValue) {
      this.bankTransferNumber = newValue;
    }

    updatePaymentByBlik(newValue) {
      this.paymentByBlik = newValue;
    }

    updateBlikPhoneNumber(newValue) {
      this.blikPhoneNumber = newValue;
    }

    submitForm(e) {
      e.preventDefault();

      const order = {
        restaurantId: this.restaurantId,
        orderDate: this.orderDate,
        timeOfOrder: this.timeOfOrder,
        decreaseInPercent: this.decreaseInPercent,
        deliveryCostPerEverybody: this.deliveryCostPerEverybody,
        deliveryCostPerDish: this.deliveryCostPerDish,
        paymentByCash: this.paymentByCash,
        paymentByBankTransfer: this.paymentByBankTransfer,
        bankTransferNumber: this.bankTransferNumber,
        paymentByBlik: this.paymentByBlik,
        blikPhoneNumber: this.blikPhoneNumber
      };

      OrdersApiConnector.createOrder(order)
        .catch(errResponse => ApiConnector.handleError(errResponse));

      return false;
    }

    cancelEdit() {
      this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
    }

    get loading() {
      return this.$store.state.loading;
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