<template>
  <div>
    <template v-if="this.loadingEntry === false">
      <errors-component />

      <div class="form-wrapper">
        <order-entry-form :order-entry-data="orderEntryData" @change="updateOrderEntryData($event)"></order-entry-form>

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
  CANCEL_DISH_ENTRY_MODIFICATION,
  NAMESPACE_MODIFY_ORDER_ENTRY, OrderEntryData,
  SET_ENTRY_LOADING_TRUE,
  SETUP_EDIT_ORDER_ENTRY_ACTION,
  UPDATE_ORDER_ENTRY_ACTION
} from "@/store/modules/ModifyOrderEntryModule";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {
  ParticipantsDishEntry,
  ParticipantsOrderEntry
} from "../../../../frontend-client";

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

  created() {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_LOADING_TRUE}`
    );
  }

  mounted() {
    this.$store.dispatch(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${SETUP_EDIT_ORDER_ENTRY_ACTION}`,
      { dishEntry: this.dishEntry }
    );
  }

  submitForm(e: Event) {
    e.preventDefault();

    this.$store.dispatch(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_ORDER_ENTRY_ACTION}`,
      { orderEntryId: this.orderEntry.id }
    );

    return false;
  }

  cancelEdit() {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`,
      {}
    );
  }

  get loadingEntry() {
    return this.$store.state.modifyOrderEntry.loadingEntry;
  }

  get orderEntryData() {
    return this.$store.state.modifyOrderEntry.orderEntryData;
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
