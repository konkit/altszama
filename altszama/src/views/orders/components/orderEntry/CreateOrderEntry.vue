<template>
  <div>
    <template v-if="this.loadingEntry === false">
      <errors-component/>

      <div>
        <order-entry-form></order-entry-form>

        <v-spacer></v-spacer>

        <v-btn color="success" @click="submitForm">
          Submit
        </v-btn>

        <v-btn @click="cancelEdit()">
          Cancel
        </v-btn>
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
  import ErrorsComponent from '../../../commons/ErrorsComponent.vue'
  import Spinner from '../../../commons/Spinner.vue'

  import OrderEntryForm from './OrderEntryForm.vue'
  import {
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY,
    SAVE_ORDER_ENTRY_ACTION,
    SET_ENTRY_LOADING_FALSE,
    SET_ENTRY_LOADING_TRUE,
    SETUP_CREATE_ORDER_ENTRY_ACTION,
  } from "../../../../store/modules/ModifyOrderEntryModule";
  import Component from "vue-class-component";
  import Vue from "vue";

  @Component({
    components: {
      ErrorsComponent,
      Spinner,
      OrderEntryForm,
    }
  })
  export default class CreateOrderEntry extends Vue {
    created() {
      this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_LOADING_TRUE}`)
    }

    mounted() {
      this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SETUP_CREATE_ORDER_ENTRY_ACTION}`);
      this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_LOADING_FALSE}`)
    }

    submitForm(e: Event) {
      e.preventDefault();

      this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SAVE_ORDER_ENTRY_ACTION}`);

      return false;
    }

    cancelEdit() {
      this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
    }

    get order() {
      return this.$store.state.showOrder.order
    }

    get allDishesInRestaurant() {
      return this.$store.state.showOrder.allDishesInRestaurant
    }

    get loadingEntry() {
      return this.$store.state.modifyOrderEntry.loadingEntry;
    }

    get orderId() {
      return this.$store.state.modifyOrderEntry.orderId;
    }

    get dishId() {
      return this.$store.state.modifyOrderEntry.dishId;
    }

    get additionalComments() {
      return this.$store.state.modifyOrderEntry.additionalComments;
    }

    get newDish() {
      return this.$store.state.modifyOrderEntry.newDish;
    }

    get newDishName() {
      return this.$store.state.modifyOrderEntry.newDishName;
    }

    get newDishPrice() {
      return this.$store.state.modifyOrderEntry.newDishPrice;
    }

    get chosenSideDishes() {
      return this.$store.state.modifyOrderEntry.chosenSideDishes;
    }
  }
</script>

<style scoped>
</style>
