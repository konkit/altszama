<template>
  <ViewWrapper>
    <LoadingView>
      <v-container>
        <errors-component/>

        <v-row>
          <v-col cols="12">
            <NoRestaurantsGuard :restaurantsList="this.restaurantsList">

              <v-stepper alt-labels v-model="stepperState" class="elevation-0">
                <v-stepper-header>
                  <v-stepper-step :complete="stepperState > 1" step="1">
                    Select restaurant
                  </v-stepper-step>

                  <v-divider></v-divider>

                  <v-stepper-step step="2">Fill details</v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1">
                    <select-restaurant-step 
                      :restaurantId="restaurantId" 
                      :restaurantsList="restaurantsList"
                      @next="next()"
                      @back="back()"
                      @updateRestaurantId="updateRestaurantId($event)">
                    </select-restaurant-step>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <h1>Fill details</h1>

                    <v-row>
                      <v-col cols="12" sm="4">
                        <h3>Order time</h3>
                        <TimePicker
                            :value="timeOfOrder"
                            @input="updateTimeOfOrder($event)"
                            label="Order time"
                        ></TimePicker>
                      </v-col>

                      <v-col cols="12" sm="4">
                        <PriceModifiersFields :price-modifiers="priceModifiers"
                                              @input="(newPriceModifiers) => {priceModifiers = newPriceModifiers}"/>
                      </v-col>

                      <v-col cols="12" sm="4">
                        <PaymentDataFields :payment-data="paymentData"
                                           @input="(newPaymentData) => {paymentData = newPaymentData}"/>
                      </v-col>
                    </v-row>

                    <v-btn color="primary" @click="(e) => submitForm(e)">Create</v-btn>
                    <v-btn text @click="back()">Back</v-btn>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </NoRestaurantsGuard>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import router from "@/router/index";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import LoadingView from "@/views/commons/LoadingView.vue";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import TimePicker from "@/views/commons/TimePicker.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import ErrorHandler from "@/lib/ErrorHandler";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";
import {OrderSaveRequest, RestaurantDto} from "@/frontend-client";
import NoRestaurantsGuard from "@/views/orders/components/orderCreateForm/NoRestaurantsGuard.vue";
import PriceModifiersFields from "@/views/orders/components/orderCreateForm/PriceModifiersFields.vue";
import {PaymentDataFieldsValue, PriceModifierFieldsValue} from "@/views/orders/components/orderCreateForm/model";
import PaymentDataFields from "@/views/orders/components/orderCreateForm/PaymentDataFields.vue";
import SelectRestaurantStep from "@/views/orders/components/orderCreateForm/SelectRestaurantStep.vue"

@Component({
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  components: {
    PaymentDataFields,
    PriceModifiersFields,
    NoRestaurantsGuard,
    ViewWrapper,
    TimePicker,
    MoneyInput,
    LoadingView,
    ErrorsComponent,
    SelectRestaurantStep
  }
})
export default class OrderCreateForm extends Vue {
  restaurantsList: RestaurantDto[] = [];

  stepperState = 1

  // Order
  restaurantId = "";
  orderDate = "";
  timeOfOrder = "";

  priceModifiers: PriceModifierFieldsValue = {
    decreaseInPercent: 0,
    deliveryCostPerEverybody: 0,
    deliveryCostPerDish: 0
  }

  paymentData: PaymentDataFieldsValue = {
    paymentByCash: true,
    paymentByBankTransfer: false,
    bankTransferNumber: "",
    paymentByBlik: false,
    blikPhoneNumber: ""
  }

  connector: OrdersApiConnector = new OrdersApiConnector();

  created() {
    this.$store.commit("setLoadingTrue");
  }

  mounted() {
    this.connector
        .getOrderCreateData()
        .then(response => {
          const restaurantId =
              (response.restaurantsList &&
                  response.restaurantsList[0] &&
                  response.restaurantsList[0].id) ||
              "";

          this.restaurantsList = response.restaurantsList;

          this.restaurantId = restaurantId;
          this.orderDate = response.orderDate;
          this.timeOfOrder = response.timeOfOrder;

          this.priceModifiers = {
            decreaseInPercent: 0,
            deliveryCostPerEverybody: 0,
            deliveryCostPerDish: 0
          }

          this.paymentData = {
            paymentByCash: true,
            paymentByBankTransfer: false,
            bankTransferNumber: "",
            paymentByBlik: false,
            blikPhoneNumber: ""
          }

          if (response.bankTransferNumber) {
            this.paymentData.paymentByBankTransfer = true;
            this.paymentData.bankTransferNumber = response.bankTransferNumber;
          }

          if (response.blikPhoneNumber) {
            this.paymentData.paymentByBlik = true;
            this.paymentData.blikPhoneNumber = response.blikPhoneNumber;
          }

          this.$store.commit("setTitle", "Create new order")
          this.$store.commit("setLoadingFalse");
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  updateRestaurantId(newValue: string) {
    this.restaurantId = newValue;
  }

  updateTimeOfOrder(newValue: string) {
    this.timeOfOrder = newValue;
  }

  submitForm(e: Event) {
    e.preventDefault();

    const order: OrderSaveRequest = {
      restaurantId: this.restaurantId,
      orderDate: this.orderDate,
      timeOfOrder: this.timeOfOrder,
      deliveryData: this.priceModifiers,
      paymentData: this.paymentData
    };

    this.connector.createOrder(order)
        .then(() => router.push({name: "TodayOrders"}))
        .catch(errResponse => ErrorHandler.handleError(errResponse));

    return false;
  }

  cancelEdit() {
    this.$store.commit("modifyOrderEntry/cancelDishEntryModification",{});
  }

  get loading() {
    return this.$store.state.loading;
  }

  next() {
    this.stepperState = this.stepperState + 1
  }

  back() {
    if (this.stepperState > 1) {
      this.stepperState -= 1
    } else {
      this.$router.back()
    }
  }

}
</script>

<style scoped>
.v-stepper__header {
  box-shadow: none;
}
</style>
