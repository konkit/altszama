<template>
  <v-list-item two-line :key="historyEntry.orderId" @click="goToOrder(historyEntry.orderId)" :class="{paid: isPaid()}">
    <v-list-item-content>
      <v-list-item-title>
        <h3>({{ historyEntry.orderDate }}) {{ historyEntry.orderCreator }} ordered from {{
            historyEntry.restaurantName
          }}</h3>
      </v-list-item-title>
      <v-list-item-subtitle>
        Amount:
        <price-element :dataPrice="historyEntry.orderEntryAmount"/>
        ({{ historyEntry.status }})
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Navigation from '../../commons/Navigation.vue';
import ViewWrapper from '../../commons/ViewWrapper.vue';
import LoadingView from '../../commons/LoadingView.vue';
import { OrderHistoryParticipatedEntry } from '@/frontend-client';
import PriceElement from '@/views/commons/PriceElement.vue';

@Component({
  components: {
    PriceElement,
    Navigation,
    ViewWrapper,
    LoadingView,
  },
})
export default class ParticipatedEntryComponent extends Vue {
  @Prop() historyEntry: OrderHistoryParticipatedEntry

  goToOrder(orderId: string) {
    this.$router.push({ name: 'ShowOrder', params: { id: orderId } });
  }

  isPaid() {
    return this.historyEntry.status === OrderHistoryParticipatedEntry.StatusEnum.CONFIRMED;
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
