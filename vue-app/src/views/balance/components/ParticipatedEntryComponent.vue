<template>
  <v-list-item two-line :key="historyEntry.orderId" @click="goToOrder(historyEntry.orderId)">
    <v-list-item-content>
      <v-list-item-title>
        <h3>({{ historyEntry.orderDate }}) Participated in order from {{ historyEntry.restaurantName }} by {{historyEntry.orderCreator}}</h3>
      </v-list-item-title>
      <v-list-item-subtitle>
        Amount:
        <price-element :dataPrice="historyEntry.orderEntryAmount" />
        ({{ historyEntry.status }})
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
export default class ParticipatedEntryComponent extends Vue {
  @Prop() historyEntry: OrderHistoryParticipatedEntry

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