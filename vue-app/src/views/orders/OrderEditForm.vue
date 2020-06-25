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

<script lang="ts">
  import ErrorsComponent from '../commons/Errors'
  import LoadingView from "../commons/LoadingView";
  import {
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../store/modules/ModifyOrderEntryState";
  import MoneyInput from "../commons/MoneyInput";
  import TimePicker from "../commons/TimePicker";
  import OrderStateButtons from "./components/OrderStateButtons";
  import ViewWrapper from "../commons/ViewWrapper";
  import Vue from "vue";
  import Component from "vue-class-component";
  import OrdersApiConnector from "../../lib/OrdersApiConnector";
  import ApiConnector from "../../lib/ApiConnector";
  import {FETCH_ORDER_DATA_ACTION, NAMESPACE_SHOW_ORDER} from "../../store/modules/ShowOrderState";

  @Component({
    components: {
      ViewWrapper,
      OrderStateButtons,
      TimePicker,
      MoneyInput,
      LoadingView,
      ErrorsComponent,
    }
  })
  export default class OrderEditForm extends Vue {
    orderId = "";

    // Order
    orderId = 0;
    restaurantId = "";
    restaurantName = "";
    orderDate = "";
    timeOfOrder = 0;
    decreaseInPercent = 0;
    deliveryCostPerEverybody = 0;
    deliveryCostPerDish = 0;
    paymentByCash = true;
    paymentByBankTransfer = false;
    bankTransferNumber = "";
    paymentByBlik = false;
    blikPhoneNumber = "";
    
    mounted() {
      this.orderId = this.$route.params.id;
      // this.$store.dispatch(`editOrder/${INIT_EDIT_ORDER_ACTION}`, {orderId: this.orderId})

      OrdersApiConnector.getOrderEditData(this.orderId)
        .then(response => {
          this.orderId = response.orderId;

          this.restaurantName = response.order.restaurantName;
          this.orderDate = response.order.orderDate;
          this.timeOfOrder = response.order.timeOfOrder;
          this.decreaseInPercent = response.order.decreaseInPercent;
          this.deliveryCostPerEverybody = response.order.deliveryCostPerEverybody;
          this.deliveryCostPerDish = response.order.deliveryCostPerDish;
          this.paymentByCash = response.order.paymentByCash;
          this.paymentByBankTransfer = response.order.paymentByBankTransfer;
          this.bankTransferNumber = response.order.bankTransferNumber || "";
          this.paymentByBlik = response.order.paymentByBlik ;
          this.blikPhoneNumber = response.order.blikPhoneNumber || "";

          // this.commit(`editOrder/${INIT_DATA}`, responseWithOrderId);
          this.$store.commit('setLoadingFalse');

          document.title = `Edit order from ${response.order.restaurantName} | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }

    submitForm(e) {
      e.preventDefault();

      const order = {
        orderId: this.orderId,
        orderDate: this.orderDate,
        timeOfOrder: this.timeOfOrder,
        decreaseInPercent: this.decreaseInPercent,
        deliveryCostPerEverybody: this.deliveryCostPerEverybody,
        deliveryCostPerDish: this.deliveryCostPerDish,
        paymentByCash: this.paymentByCash,
        paymentByBankTransfer: this.paymentByBankTransfer,
        bankTransferNumber: this.bankTransferNumber || "",
        paymentByBlik: this.paymentByBlik,
        blikPhoneNumber: this.blikPhoneNumber || ""
      };

      OrdersApiConnector.editOrder(order.orderId, order)
        .then(() => {
          this.$store.commit('setLoadingTrue');
          this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {});
          this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, {orderId: this.orderId});
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))

      return false;
    }

    updateOrderDate(newValue) {
      this.orderDate = newValue;
    }

    updateTimeOfOrder(newValue) {
      this.timeOfOrder = newValue;
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

    cancelEdit() {
      this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
    }

    get loading() {
      return this.$store.state.loading;
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