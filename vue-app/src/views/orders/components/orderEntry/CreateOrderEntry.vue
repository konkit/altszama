<template>
  <div>
    <template v-if="this.loadingEntry === false">
      <errors-component />

      <div>
        <order-entry-form :all-dishes-by-category="allDishesByCategory"
                          :dish-id-to-side-dishes-map="dishIdToSideDishesMap"
                          :order-entry-data="orderEntryData"
                          @change="updateOrderEntryData($event)">
        </order-entry-form>

        <v-spacer></v-spacer>

        <v-btn color="primary" @click="submitForm">Submit</v-btn>
        <v-btn @click="cancelEdit()">Cancel</v-btn>
      </div>
    </template>

    <template v-if="this.loadingEntry === true">
      <div class="justify-content-center">
        <spinner></spinner>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import ErrorsComponent from "../../../commons/ErrorsComponent.vue";
import Spinner from "../../../commons/Spinner.vue";

import OrderEntryForm from "./orderEntryForm/OrderEntryForm.vue";
import {
  OrderEntryData
} from "@/store/modules/ModifyOrderEntryModule";
import Component from "vue-class-component";
import Vue from "vue";
import {ShowOrderState} from "@/store/modules/ShowOrderModule";
import ErrorHandler from "@/lib/ErrorHandler";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";
import {DishDto, SideDish} from "@/frontend-client";

@Component({
  components: {
    ErrorsComponent,
    Spinner,
    OrderEntryForm
  }
})
export default class CreateOrderEntry extends Vue {

  ordersConnector = new OrdersApiConnector()

  created() {
    this.$store.commit("modifyOrderEntry/setEntryLoading", true)
  }

  mounted() {
    this.$store.commit("clearErrors");

    const showOrderState = this.$store.state.showOrder as ShowOrderState;

    const orderId = showOrderState.order.id;

    let dishId;
    if (showOrderState.allDishesInRestaurant.length > 0) {
      dishId = showOrderState.allDishesInRestaurant[0].id;
    } else {
      dishId = null;
    }

    this.$store.commit(`modifyOrderEntry/setInitialCreateOrderEntry`,{ orderId: orderId, dishId: dishId });
    this.$store.commit("modifyOrderEntry/setEntryLoading", false)
  }

  submitForm(e: Event) {
    e.preventDefault();

    const state = this.$store.state.modifyOrderEntry

    const orderId = state.orderId;

    const orderEntryToSave = {
      orderId: state.orderId,
      dishId: state.orderEntryData.dishId,
      dishEntryId: state.dishEntryId,
      additionalComments: state.orderEntryData.additionalComments,
      newDish: state.orderEntryData.newDish,
      newDishName: state.orderEntryData.newDishName,
      newDishPrice: state.orderEntryData.newDishPrice,
      chosenSideDishes: state.orderEntryData.chosenSideDishes
    };

    this.ordersConnector
        .saveOrderEntry(orderId, orderEntryToSave)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.commit(`modifyOrderEntry/cancelDishEntryModification`,{});
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, orderId);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));

    return false;
  }

  cancelEdit() {
    this.$store.commit(`modifyOrderEntry/cancelDishEntryModification`,{});
  }

  get allDishesInRestaurant() {
    return this.$store.state.showOrder.allDishesInRestaurant;
  }

  get loadingEntry() {
    return this.$store.state.modifyOrderEntry.loadingEntry;
  }

  get orderEntryData() {
    return this.$store.state.modifyOrderEntry.orderEntryData;
  }

  get allDishesByCategory(): { [category: string]: DishDto[] } {
    return this.$store.state.showOrder.allDishesByCategory;
  }

  get dishIdToSideDishesMap(): { [key: string]: SideDish[] } {
    return this.$store.state.showOrder.dishIdToSideDishesMap;
  }

  updateOrderEntryData(newOrderEntryData: OrderEntryData) {
    this.$store.commit("modifyOrderEntry/updateOrderEntryData", newOrderEntryData)
  }
}
</script>

<style scoped></style>
