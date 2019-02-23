<template>
  <div>
    <h4>Price summary</h4>

    <dt v-if="orderDecreaseInPercent !== 0 || orderDeliveryCostPerEverybody !== 0">
      Base price :
    </dt>
    <dd v-if="orderDecreaseInPercent !== 0 || orderDeliveryCostPerEverybody !== 0">
      <price :data-price="basePriceSum"/>
    </dd>

    <dt v-if="orderDecreaseInPercent !== 0">
      Price decrease :
    </dt>
    <dd v-if="orderDecreaseInPercent !== 0">
      - {{orderDecreaseInPercent}} %
    </dd>

    <dt v-if="orderDeliveryCostPerEverybody !== 0">
      Delivery :
    </dt>
    <dd v-if="orderDeliveryCostPerEverybody !== 0">
      + <price :data-price="orderDeliveryCostPerEverybody"/>
    </dd>

    <dt v-if="orderDeliveryCostPerDish !== 0">
      Delivery per dish:
    </dt>
    <dd v-if="orderDeliveryCostPerDish !== 0">
      + <price :data-price="orderDeliveryCostPerDish"/> * {{allEatingPeopleCount}}
    </dd>

    <dt>Total:</dt>
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