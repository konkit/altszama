<template>
  <div>
    <div class="grid-container">
      <div>Base price :</div>
      <div><b><price :data-price="basePriceSum"/></b></div>

      <div>Price decrease :</div>
      <div><b>- {{orderDecreaseInPercent}} %</b></div>

      <div>Delivery :</div>
      <div><b>+ <price :data-price="orderDeliveryCostPerEverybody"/></b></div>

      <div>Delivery per dish:</div>
      <div><b>+ <price :data-price="orderDeliveryCostPerDish"/> * {{allEatingPeopleCount}}</b></div>

      <div><b>Total:</b></div>
      <div><b><price :data-price="totalPrice"/></b></div>
    </div>
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