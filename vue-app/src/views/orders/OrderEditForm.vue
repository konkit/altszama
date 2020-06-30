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
  import ErrorsComponent from '../commons/ErrorsComponent'
  import LoadingView from "../commons/LoadingView";
  import {
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../store/modules/ModifyOrderEntryModule";
  import MoneyInput from "../commons/MoneyInput";
  import TimePicker from "../commons/TimePicker";
  import OrderStateButtons from "./components/OrderStateButtons";
  import ViewWrapper from "../commons/ViewWrapper";
  import Vue from "vue";
  import Component from "vue-class-component";
  import OrdersApiConnector from "../../lib/OrdersApiConnector";
  import ApiConnector from "../../lib/ApiConnector";
  import {FETCH_ORDER_DATA_ACTION, NAMESPACE_SHOW_ORDER} from "../../store/modules/ShowOrderModule";
  import {OrderUpdateRequest} from "../../frontend-client";
  import {RootState} from "../../store";

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

    // Order
    orderId: string = "";
    restaurantId = "";
    restaurantName = "";
    orderDate = "";
    timeOfOrder = "";
    decreaseInPercent = 0;
    deliveryCostPerEverybody = 0;
    deliveryCostPerDish = 0;
    paymentByCash = true;
    paymentByBankTransfer = false;
    bankTransferNumber = "";
    paymentByBlik = false;
    blikPhoneNumber = "";

    connector: OrdersApiConnector;

    mounted() {
      this.orderId = this.$route.params.id;

      this.connector = new OrdersApiConnector(this.$store.state as RootState);

      this.connector.getOrderEditData(this.orderId)
        .then(response => {
          this.restaurantName = response.order.restaurantName;
          this.orderDate = response.order.orderDate;
          this.timeOfOrder = response.order.timeOfOrder;
          this.decreaseInPercent = response.order.deliveryData.decreaseInPercent;
          this.deliveryCostPerEverybody = response.order.deliveryData.deliveryCostPerEverybody;
          this.deliveryCostPerDish = response.order.deliveryData.deliveryCostPerDish;
          this.paymentByCash = response.order.paymentData.paymentByCash;
          this.paymentByBankTransfer = response.order.paymentData.paymentByBankTransfer;
          this.bankTransferNumber = response.order.paymentData.bankTransferNumber || "";
          this.paymentByBlik = response.order.paymentData.paymentByBlik;
          this.blikPhoneNumber = response.order.paymentData.blikPhoneNumber || "";

          this.$store.commit('setLoadingFalse');

          document.title = `Edit order from ${response.order.restaurantName} | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }

    submitForm(e) {
      e.preventDefault();

      const order: OrderUpdateRequest = {
        orderId: this.orderId,
        orderDate: this.orderDate,
        timeOfOrder: this.timeOfOrder,
        deliveryData: {
          decreaseInPercent: this.decreaseInPercent,
          deliveryCostPerEverybody: this.deliveryCostPerEverybody,
          deliveryCostPerDish: this.deliveryCostPerDish,
        },
        paymentData: {
          paymentByCash: this.paymentByCash,
          paymentByBankTransfer: this.paymentByBankTransfer,
          bankTransferNumber: this.bankTransferNumber || "",
          paymentByBlik: this.paymentByBlik,
          blikPhoneNumber: this.blikPhoneNumber || ""
        }
      };


      this.connector.editOrder(order)
        .then(() => {
          this.$store.commit('setLoadingTrue');
          this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {});
          this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${FETCH_ORDER_DATA_ACTION}`, this.orderId);
          this.$router.push("/orders/show/" + this.orderId)
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