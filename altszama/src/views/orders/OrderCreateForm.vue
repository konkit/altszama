<template>
  <ViewWrapper title="Create new order" backpath="#/orders">
    <LoadingView>
      <v-container>
        <errors-component />

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
                      :items="teamsList"
                      item-text="domain"
                      item-value="id"
                      label="Team"
                      :value="this.teamsList.find(t => teamId == t.id)"
                      @input="updateTeamId($event)"
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-autocomplete
                      :items="restaurantsList"
                      item-text="name"
                      item-value="id"
                      label="Restaurant"
                      :value="
                        this.restaurantsList.find(r => restaurantId == r.id)
                      "
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
                    <h3>Price change</h3>

                    <v-text-field
                      class="percent-input"
                      label="Price decrease (in percent)"
                      suffix="%"
                      :value="decreaseInPercent"
                      @input="updateDecreaseInPercent($event)"
                    ></v-text-field>

                    <MoneyInput
                      class="short-input"
                      label="Delivery cost (total)"
                      :value="deliveryCostPerEverybody"
                      @input="updateDeliveryCostPerEverybody($event)"
                    >
                    </MoneyInput>

                    <MoneyInput
                      class="short-input"
                      label="Delivery cost (per dish)"
                      :value="deliveryCostPerDish"
                      @input="updateDeliveryCostPerDish($event)"
                    >
                    </MoneyInput>
                  </v-col>

                  <v-col cols="4">
                    <h3>Payment</h3>

                    <v-switch
                      v-model="paymentByCash"
                      label="Payment by cash"
                    ></v-switch>

                    <v-switch
                      v-model="paymentByBankTransfer"
                      label="Payment by bank transfer"
                    ></v-switch>

                    <v-text-field
                      v-if="paymentByBankTransfer"
                      label="Bank transfer number"
                      :value="bankTransferNumber"
                      @change="updateBankTransferNumber($event)"
                    >
                    </v-text-field>

                    <v-switch
                      v-model="paymentByBlik"
                      label="Payment by BLIK"
                    ></v-switch>

                    <v-text-field
                      v-if="paymentByBlik"
                      label="BLIK phone number"
                      :value="blikPhoneNumber"
                      @change="updateBlikPhoneNumber($event)"
                    >
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
import router from "../../router/index";
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import LoadingView from "@/views/commons/LoadingView.vue";
import {
  CANCEL_DISH_ENTRY_MODIFICATION,
  NAMESPACE_MODIFY_ORDER_ENTRY
} from "../../store/modules/ModifyOrderEntryModule";
import MoneyInput from "@/views/commons/MoneyInput.vue";
import TimePicker from "@/views/commons/TimePicker.vue";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Vue from "vue";
import Component from "vue-class-component";
import ApiConnector from "../../lib/ApiConnector";
import OrdersApiConnector from "../../lib/OrdersApiConnector";
import { RootState } from "../../store";
import { OrderSaveRequest, Restaurant, Team } from "../../frontend-client";

@Component({
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  components: {
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
  teamId = "";
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

  connector?: OrdersApiConnector;

  created() {
    this.$store.commit("setLoadingTrue");
  }

  mounted() {
    this.connector = new OrdersApiConnector(this.$store.state as RootState);

    this.connector
      .getOrderCreateData()
      .then(response => {
        // .then(response => {
        console.log("Response: ", response);

        const restaurantId =
          (response.restaurantsList &&
            response.restaurantsList[0] &&
            response.restaurantsList[0].id) ||
          "";
        const teamId =
          (response.teamsList &&
            response.teamsList[0] &&
            response.teamsList[0].id) ||
          "";

        const bankTransferNumber = "";
        const paymentByBankTransfer = false;
        if (response.bankTransferNumber) {
          this.paymentByBankTransfer = true;
          this.bankTransferNumber = response.bankTransferNumber;
        }

        const blikPhoneNumber = "";
        const paymentByBlik = false;
        if (response.blikPhoneNumber) {
          this.paymentByBlik = true;
          this.blikPhoneNumber = response.blikPhoneNumber;
        }

        // return {
        //   restaurantsList: response.restaurantsList,
        //   teamsList: response.teamsList,
        //   order: {
        //     restaurantId: restaurantId,
        //     teamId: teamId,
        //     orderDate: response.orderDate,
        //     timeOfOrder: response.timeOfOrder,
        //
        //     decreaseInPercent: 0,
        //     deliveryCostPerEverybody: 0,
        //     deliveryCostPerDish: 0,
        //     paymentByCash: true,
        //     paymentByBankTransfer: paymentByBankTransfer,
        //     bankTransferNumber: bankTransferNumber,
        //     paymentByBlik: paymentByBlik,
        //     blikPhoneNumber: blikPhoneNumber
        //   }
        // }
        // });

        this.restaurantsList = response.restaurantsList;
        this.teamsList = response.teamsList;

        this.restaurantId = restaurantId;
        this.teamId = teamId;
        this.orderDate = response.orderDate;
        this.timeOfOrder = response.timeOfOrder;

        this.decreaseInPercent = 0;
        this.deliveryCostPerEverybody = 0;
        this.deliveryCostPerDish = 0;
        this.paymentByCash = true;
        this.paymentByBankTransfer = paymentByBankTransfer;
        this.bankTransferNumber = bankTransferNumber;
        this.paymentByBlik = paymentByBlik;
        this.blikPhoneNumber = blikPhoneNumber;

        this.$store.commit("setLoadingFalse");
        document.title = `Create new order | Alt Szama`;
      })
      .catch(errResponse => ApiConnector.handleError(errResponse));
  }

  updateTeamId(newValue: string) {
    this.teamId = newValue;
  }

  updateRestaurantId(newValue: string) {
    this.restaurantId = newValue;
  }

  updateOrderDate(newValue: string) {
    this.orderDate = newValue;
  }

  updateTimeOfOrder(newValue: string) {
    this.timeOfOrder = newValue;
  }

  updateDecreaseInPercent(newValue: number) {
    this.decreaseInPercent = newValue;
  }

  updateDeliveryCostPerEverybody(newValue: number) {
    this.deliveryCostPerEverybody = newValue;
  }

  updateDeliveryCostPerDish(newValue: number) {
    this.deliveryCostPerDish = newValue;
  }

  updateBankTransferNumber(newValue: string) {
    this.bankTransferNumber = newValue;
  }

  updateBlikPhoneNumber(newValue: string) {
    this.blikPhoneNumber = newValue;
  }

  submitForm(e: Event) {
    e.preventDefault();

    const order: OrderSaveRequest = {
      restaurantId: this.restaurantId,
      teamId: this.teamId,
      orderDate: this.orderDate,
      timeOfOrder: this.timeOfOrder,
      deliveryData: {
        decreaseInPercent: this.decreaseInPercent,
        deliveryCostPerEverybody: this.deliveryCostPerEverybody,
        deliveryCostPerDish: this.deliveryCostPerDish
      },
      paymentData: {
        paymentByCash: this.paymentByCash,
        paymentByBankTransfer: this.paymentByBankTransfer,
        bankTransferNumber: this.bankTransferNumber,
        paymentByBlik: this.paymentByBlik,
        blikPhoneNumber: this.blikPhoneNumber
      }
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
