<template>
  <ViewWrapper>
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
            <v-row>
              <v-col>
                <h3>Order time</h3>
                <TimePicker
                    :value="timeOfOrder"
                    @input="updateTimeOfOrder($event)"
                    label="Order time"
                ></TimePicker>
              </v-col>

              <v-col>
                <PriceModifiersFields :price-modifiers="priceModifiers"
                                      @input="(newPriceModifiers) => {priceModifiers = newPriceModifiers}"/>
              </v-col>

              <v-col>
                <PaymentDataFields :payment-data="paymentData"
                                   @input="(newPaymentData) => {paymentData = newPaymentData}"/>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-btn color="primary" block @click="submitForm">
                  Update
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import LoadingView from "@/views/commons/LoadingView.vue";
import {CANCEL_DISH_ENTRY_MODIFICATION, NAMESPACE_MODIFY_ORDER_ENTRY} from "@/store/modules/ModifyOrderEntryModule";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import TimePicker from "@/views/commons/TimePicker.vue";
import OrderStateButtons from "@/views/orders/components/OrderStateButtons.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";
import ErrorHandler from "@/lib/ErrorHandler";
import {OrderUpdateRequest} from "@/frontend-client";
import PriceModifiersFields from "@/views/orders/components/orderCreateForm/PriceModifiersFields.vue";
import PaymentDataFields from "@/views/orders/components/orderCreateForm/PaymentDataFields.vue";
import {PaymentDataFieldsValue, PriceModifierFieldsValue} from "@/views/orders/components/orderCreateForm/model";

@Component({
  components: {
    ViewWrapper,
    OrderStateButtons,
    TimePicker,
    MoneyInput,
    LoadingView,
    ErrorsComponent,
    PriceModifiersFields,
    PaymentDataFields
  }
})
export default class OrderEditForm extends Vue {
  // Order
  orderId = "";
  restaurantId = "";
  restaurantName = "";
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

  mounted() {
    this.orderId = this.$route.params.id;

    this.connector
        .getOrderEditData(this.orderId)
        .then(response => {
          this.restaurantName = response.order.restaurantName;
          this.orderDate = response.order.orderDate;
          this.timeOfOrder = response.order.timeOfOrder || "";

          this.priceModifiers = {
            decreaseInPercent: response.order.deliveryData.decreaseInPercent,
            deliveryCostPerEverybody: response.order.deliveryData.deliveryCostPerEverybody,
            deliveryCostPerDish: response.order.deliveryData.deliveryCostPerDish
          }

          this.paymentData = {
            paymentByCash: response.order.paymentData.paymentByCash,
            paymentByBankTransfer: response.order.paymentData.paymentByBankTransfer,
            bankTransferNumber: response.order.paymentData.bankTransferNumber || "",
            paymentByBlik:  response.order.paymentData.paymentByBlik,
            blikPhoneNumber: response.order.paymentData.blikPhoneNumber || ""
          }

          this.$store.commit("setTitle", `Edit order from ${response.order.restaurantName}`)
          this.$store.commit("setLoadingFalse");
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));
  }

  submitForm(e: Event) {
    e.preventDefault();

    const order: OrderUpdateRequest = {
      orderId: this.orderId,
      orderDate: this.orderDate,
      timeOfOrder: this.timeOfOrder,
      deliveryData: this.priceModifiers,
      paymentData: this.paymentData
    };

    this.connector!.editOrder(order)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.commit(
              `${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`,
              {}
          );
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, this.orderId);
          this.$router.back();
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));

    return false;
  }

  updateTimeOfOrder(newValue: string) {
    this.timeOfOrder = newValue;
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
