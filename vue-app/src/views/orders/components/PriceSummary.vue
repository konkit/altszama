<template>
  <div>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Base price :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <price :data-price="basePriceSum" />
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="item-dense">
        <v-list-item-content>
          <v-list-item-title>Price decrease :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="unbreakable">- {{ orderDecreaseInPercent }} %</span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="item-dense">
        <v-list-item-content>
          <v-list-item-title>Delivery :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="unbreakable"
            >+ <price :data-price="orderDeliveryCostPerEverybody"
          /></span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="item-dense">
        <v-list-item-content>
          <v-list-item-title>Delivery per dish:</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="unbreakable"
            >+ <price :data-price="orderDeliveryCostPerDish" /> *
            {{ allEatingPeopleCount }}</span
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Total:</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <price :data-price="totalPrice" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Price from "@/views/commons/PriceElement.vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  components: {
    Price
  }
})
export default class PriceSummary extends Vue {
  @Prop() orderDecreaseInPercent!: number;
  @Prop() orderDeliveryCostPerEverybody!: number;
  @Prop() basePriceSum!: number;
  @Prop() orderDeliveryCostPerDish!: number;
  @Prop() allEatingPeopleCount!: number;
  @Prop() totalPrice!: number;
}
</script>

<style scoped>
.unbreakable {
  word-break: keep-all;
}
</style>
