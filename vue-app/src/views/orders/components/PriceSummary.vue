<template>
  <div>
    <h3>Price summary</h3>

    <dt v-if="orderDecreaseInPercent !== 0 || orderDeliveryCostPerEverybody !== 0">
      Base price :
    </dt>
    <dd v-if="orderDecreaseInPercent !== 0 || orderDeliveryCostPerEverybody !== 0">
      <b>
        <price :data-price="basePriceSum"/>
      </b>
    </dd>

    <dt v-if="orderDecreaseInPercent !== 0">
      Price decrease :
    </dt>
    <dd v-if="orderDecreaseInPercent !== 0">
      <b>- {{orderDecreaseInPercent}} %</b>
    </dd>

    <dt v-if="orderDeliveryCostPerEverybody !== 0">
      Delivery :
    </dt>
    <dd v-if="orderDeliveryCostPerEverybody !== 0">
      <b>+ <price :data-price="orderDeliveryCostPerEverybody"/></b>
    </dd>

    <dt v-if="orderDeliveryCostPerDish !== 0">
      Delivery per dish:
    </dt>
    <dd v-if="orderDeliveryCostPerDish !== 0">
      <b>+ <price :data-price="orderDeliveryCostPerDish"/> * {{allEatingPeopleCount}}</b>
    </dd>

    <dt class="pt-3"><b>Total:</b></dt>
    <dd><b><price :data-price="totalPrice"/></b></dd>
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
</style>