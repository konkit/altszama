<template>
  <div>
    <h3>Price summary</h3>

    <div class="grid-container">
      <div class="pt-2" v-if="orderDecreaseInPercent !== 0 || orderDeliveryCostPerEverybody !== 0">
        Base price :
      </div>

      <div class="pt-2" v-if="orderDecreaseInPercent !== 0 || orderDeliveryCostPerEverybody !== 0">
        <b><price :data-price="basePriceSum"/></b>
      </div>


      <div class="pt-2" v-if="orderDecreaseInPercent !== 0">
        Price decrease :
      </div>

      <div class="pt-2" v-if="orderDecreaseInPercent !== 0">
        <b>- {{orderDecreaseInPercent}} %</b>
      </div>


      <div class="pt-2" v-if="orderDeliveryCostPerEverybody !== 0">
        Delivery :
      </div>

      <div class="pt-2" v-if="orderDeliveryCostPerEverybody !== 0">
        <b>+ <price :data-price="orderDeliveryCostPerEverybody"/></b>
      </div>


      <div class="pt-2" v-if="orderDeliveryCostPerDish !== 0">
        Delivery per dish:
      </div>

      <div class="pt-2" v-if="orderDeliveryCostPerDish !== 0">
        <b>+ <price :data-price="orderDeliveryCostPerDish"/> * {{allEatingPeopleCount}}</b>
      </div>

    </div>

    <div class="pt-3"><b>Total:</b></div>
    <div><b><price :data-price="totalPrice"/></b></div>
  </div>
</template>

<script>
  import SimpleCard from "../../commons/SimpleCard";
  import Price from "../../commons/PriceElement"
  import ErrorsComponent from '../../commons/Errors'

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
      SimpleCard,
      Price,
      ErrorsComponent
    }
  }
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 125px 1fr;
  }
</style>