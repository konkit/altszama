<template>
  <v-list-item two-line :key="historyEntry.orderId" @click="goToOrder(historyEntry.orderId)" :class="{paid: isPaid()}">
    <v-list-item-content>
      <v-list-item-title>
        <h3>({{ historyEntry.orderDate }}) You ordered from {{ historyEntry.restaurantName }}</h3>
      </v-list-item-title>
      <v-list-item-subtitle>
        Payments confirmed:

        <v-template v-if="!isPaid()">
          <b>
            <price-element :dataPrice="historyEntry.confirmedPaymentsTotalAmount"/>
            /
            <price-element :dataPrice="historyEntry.totalAmount"/>
          </b>
        </v-template>

        <v-template v-if="isPaid()">
          <price-element :dataPrice="historyEntry.confirmedPaymentsTotalAmount"/>
          /
          <price-element :dataPrice="historyEntry.totalAmount"/>
        </v-template>


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
import {OrderHistoryCreatedEntry} from "@/frontend-client";
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

  isPaid() {
    return this.historyEntry.confirmedPaymentsTotalAmount >= this.historyEntry.totalAmount
  }
}
</script>

<style lang="scss" scoped>
.v-list-item.paid .v-list-item__content {
  .v-list-item__title, .v-list-item__subtitle {
    color: rgba(0, 0, 0, 0.38) !important;
  }
}
</style>
