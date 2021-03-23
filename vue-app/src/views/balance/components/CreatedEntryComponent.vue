<template>
  <v-list-item two-line :key="historyEntry.orderId" @click="goToOrder(historyEntry.orderId)">
    <v-list-item-content>
      <v-list-item-title>
        <h3>({{ historyEntry.orderDate }}) You ordered from {{ historyEntry.restaurantName }}</h3>
      </v-list-item-title>
      <v-list-item-subtitle>
        Payments confirmed:
        <price-element :dataPrice="historyEntry.confirmedPaymentsTotalAmount"/>
        /
        <price-element :dataPrice="historyEntry.totalAmount"/>
        <span v-if="historyEntry.markedPaymentsCount">
          {{ entriesPendingString(historyEntry) }}
        </span>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Navigation from "../../commons/Navigation.vue";
import ViewWrapper from "../../commons/ViewWrapper.vue";
import LoadingView from "../../commons/LoadingView.vue";
import Vue from "vue";
import BalanceApiConnector from "@/lib/api/BalanceApiConnector";
import {OrderHistoryCreatedEntry, OrderHistoryEntry, OrderHistoryParticipatedEntry} from "@/frontend-client";
import PriceElement from "@/views/commons/PriceElement.vue";
import {Prop} from "vue-property-decorator";

@Component({
  components: {
    PriceElement,
    Navigation,
    ViewWrapper,
    LoadingView
  }
})
export default class CreatedEntryComponent extends Vue {
  @Prop() historyEntry: OrderHistoryCreatedEntry

  goToOrder(orderId: string) {
    this.$router.push({name: "ShowOrder", params: {id: orderId}})
  }

  entriesPendingString(historyEntry: OrderHistoryCreatedEntry) {
    return `(${historyEntry.markedPaymentsCount} entries pending confirmation - ${historyEntry.markedPaymentsTotalAmount})`
  }
}
</script>

<style scoped>
</style>