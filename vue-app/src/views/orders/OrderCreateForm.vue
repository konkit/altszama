<template>
  <ViewWrapper title="Create new order" backpath="#/orders">
    <LoadingView>
      <v-container>
        <errors-component/>

        <v-row>
          <v-col cols="12">
            <NoRestaurantsGuard :restaurantsList="this.restaurantsList">
              <v-row>
                <v-col>
                  <v-autocomplete
                      :items="restaurantsList"
                      item-text="name"
                      item-value="id"
                      label="Restaurant"
                      :value="this.restaurantsList.find(r => restaurantId === r.id)"
                      @input="updateRestaurantId($event)"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4">
                  <h3>Order time</h3>
                  <TimePicker
                      :value="timeOfOrder"
                      @input="updateTimeOfOrder($event)"
                      label="Order time"
                  ></TimePicker>
                </v-col>

                <v-col cols="4">
                  <PriceModifiersFields :price-modifiers="priceModifiers"
                                        @input="(newPriceModifiers) => {priceModifiers = newPriceModifiers}"/>
                </v-col>

                <v-col cols="4">
                  <PaymentDataFields :payment-data="paymentData"
                                     @input="(newPaymentData) => {paymentData = newPaymentData}"/>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-btn color="success" block @click="submitForm">
                    Create
                  </v-btn>
                </v-col>
              </v-row>
            </NoRestaurantsGuard>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import router from "../../router/index";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import LoadingView from "@/views/commons/LoadingView.vue";
import {
  CANCEL_DISH_ENTRY_MODIFICATION,
  NAMESPACE_MODIFY_ORDER_ENTRY
} from "@/store/modules/ModifyOrderEntryModule";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import TimePicker from "@/views/commons/TimePicker.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import ApiConnector from "../../lib/ApiConnector";
import OrdersApiConnector from "../../lib/OrdersApiConnector";
import {RootState} from "../../store";
import {OrderSaveRequest, Restaurant, Team} from "../../frontend-client";
import NoRestaurantsGuard from "@/views/orders/components/orderCreateForm/NoRestaurantsGuard.vue";
import PriceModifiersFields from "@/views/orders/components/orderCreateForm/PriceModifiersFields.vue";
import {PaymentDataFieldsValue, PriceModifierFieldsValue} from "@/views/orders/components/orderCreateForm/model";
import PaymentDataFields from "@/views/orders/components/orderCreateForm/PaymentDataFields.vue";

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
    ErrorsComponent
  }
})
export default class OrderCreateForm extends Vue {
  restaurantsList: Restaurant[] = [];
  teamsList: Team[] = [];

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

  connector?: OrdersApiConnector;

  created() {
    this.$store.commit("setLoadingTrue");
  }

  mounted() {
    this.connector = new OrdersApiConnector(this.$store.state as RootState);

    this.connector
        .getOrderCreateData()
        .then(response => {
          const restaurantId =
              (response.restaurantsList &&
                  response.restaurantsList[0] &&
                  response.restaurantsList[0].id) ||
              "";

          this.restaurantsList = response.restaurantsList;
          this.teamsList = response.teamsList;

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

          this.$store.commit("setLoadingFalse");
          document.title = `Create new order | Alt Szama`;
        })
        .catch(errResponse => ApiConnector.handleError(errResponse));
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

    this.connector!.createOrder(order)
        .then(() => router.push("/orders/"))
        .catch(errResponse => ApiConnector.handleError(errResponse));

    return false;
  }

  cancelEdit() {
    this.$store.commit(
        `${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`,
        {}
    );
  }

  get loading() {
    return this.$store.state.loading;
  }
}
</script>

<style scoped>

</style>
