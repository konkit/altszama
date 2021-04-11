<template>
  <div>
    <template v-if="this.loadingEntry === false">
      <errors-component/>

      <div class="form-wrapper">
        <order-entry-form :all-dishes-in-restaurant="allDishesInRestaurant"
                          :order-entry-data="orderEntryData"
                          :all-dishes-by-category="allDishesByCategory"
                          :dish-id-to-side-dishes-map="dishIdToSideDishesMap"
                          @change="updateOrderEntryData($event)">
        </order-entry-form>

        <v-spacer></v-spacer>

        <v-btn color="primary" @click="submitForm" :disabled="isSubmitDisabled">Submit</v-btn>
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
import {ExistingDishData, NewDishData, OrderEntryData} from "@/store/modules/ModifyOrderEntryModule";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import {DishDto, ParticipantsDishEntry, ParticipantsOrderEntry, SideDish} from "../../../../frontend-client";
import {ShowOrderState} from "@/store/modules/ShowOrderModule";
import ErrorHandler from "@/lib/ErrorHandler";
import OrdersApiConnector from "@/lib/api/OrdersApiConnector";

@Component({
  components: {
    ErrorsComponent,
    Spinner,
    OrderEntryForm
  }
})
export default class EditOrderEntry extends Vue {
  @Prop() index!: number;
  @Prop() orderEntry!: ParticipantsOrderEntry;
  @Prop() dishEntry!: ParticipantsDishEntry;

  ordersConnector = new OrdersApiConnector()

  created() {
    this.$store.commit("modifyOrderEntry/setEntryLoading", true)
  }

  mounted() {
    this.$store.commit("clearErrors");

    const showOrderState = this.$store.state.showOrder as ShowOrderState;

    const orderId = showOrderState.order.id;

    this.$store.commit("modifyOrderEntry/setInitialEditedOrderEntry", {orderId: orderId, dishEntry: this.dishEntry});
    this.$store.commit("modifyOrderEntry/setEntryLoading", false)
  }

  submitForm(e: Event) {
    e.preventDefault();

    const state = this.$store.state.modifyOrderEntry

    const orderId = state.orderId;

    let orderEntryToUpdate

    const dishData: (NewDishData | ExistingDishData) = state.orderEntryData.dishData
    if (dishData.kind === "NewDishData") {
      orderEntryToUpdate = {
        orderId: orderId,
        dishId: "",
        dishEntryId: state.dishEntryId,
        additionalComments: state.orderEntryData.additionalComments,
        newDish: true,
        newDishName: dishData.newDishName,
        newDishPrice: dishData.newDishPrice,
        chosenSideDishes: dishData.chosenSideDishes
      };
    } else {
      orderEntryToUpdate = {
        orderId: orderId,
        dishId: dishData.dishId,
        dishEntryId: state.dishEntryId,
        additionalComments: state.orderEntryData.additionalComments,
        newDish: false,
        newDishName: "",
        newDishPrice: 0,
        chosenSideDishes: dishData.chosenSideDishes
      };
    }

    this.ordersConnector
        .updateOrderEntry(orderId, this.orderEntry.id, orderEntryToUpdate)
        .then(() => {
          this.$store.commit("setLoadingTrue");
          this.$store.commit(`modifyOrderEntry/cancelDishEntryModification`, {});
          this.$store.dispatch(`showOrder/fetchOrderDataAction`, orderId);
        })
        .catch(errResponse => ErrorHandler.handleError(errResponse));

    return false;
  }

  cancelEdit() {
    this.$store.commit(`modifyOrderEntry/cancelDishEntryModification`,{});
  }

  get loadingEntry() {
    return this.$store.state.modifyOrderEntry.loadingEntry;
  }

  get allDishesInRestaurant(): DishDto[] {
    return this.$store.state.showOrder.allDishesInRestaurant;
  }

  get orderEntryData(): OrderEntryData {
    return this.$store.state.modifyOrderEntry.orderEntryData;
  }

  get isSubmitDisabled(): boolean {
    return this.orderEntryData.dishData.kind === "NewDishData" && !this.orderEntryData.dishData.newDishName ||
        (this.orderEntryData.dishData.chosenSideDishes.filter(sd => (sd.isNew == true && !sd.newSideDishName) || (sd.isNew == false && !sd.id)).length > 0)
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

<style scoped>
.form-wrapper {
  padding-top: 9px;
}
</style>
