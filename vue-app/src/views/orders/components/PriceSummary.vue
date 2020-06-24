<template>
  <div>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Base price :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <price :data-price="basePriceSum"/>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="item-dense">
        <v-list-item-content>
          <v-list-item-title>Price decrease :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="unbreakable">- {{orderDecreaseInPercent}} %</span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="item-dense">
        <v-list-item-content>
          <v-list-item-title>Delivery :</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="unbreakable">+ <price :data-price="orderDeliveryCostPerEverybody"/></span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="item-dense">
        <v-list-item-content >
          <v-list-item-title>Delivery per dish:</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <span class="unbreakable">+ <price :data-price="orderDeliveryCostPerDish"/> * {{allEatingPeopleCount}}</span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Total:</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <price :data-price="totalPrice"/>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
  import Price from "../../commons/PriceElement"

  export default {
    name: "PriceSummary",
    props: [
      "orderDecreaseInPercent",
      "orderDeliveryCostPerEverybody",
      "basePriceSum",
      "orderDeliveryCostPerDish",
      "allEatingPeopleCount",
      "totalPrice"
    ],
    components: {
      Price,
    }
  }
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 125px 1fr;
  }

  /*.item-dense {*/
    /*min-height: 16px !important;*/
  /*}*/

  /*.item-dense .v-list-item__content {*/
    /*padding-top: 0px !important;*/
    /*padding-bottom: 0px !important;*/
  /*}*/

  .unbreakable {
    word-break: keep-all;
  }
</style>