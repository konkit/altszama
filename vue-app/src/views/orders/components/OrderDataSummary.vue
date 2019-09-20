<template>
  <div class="grid-container">
    <div>Who will order?</div>
    <div><b>{{ this.order.orderCreatorUsername }}</b></div>

    <div>When?</div>
    <div><b>{{ this.order.timeOfOrder }}</b></div>

    <div>When it'll arrive?</div>
    <div><b>{{ this.timeOfDeliveryOrNA() }}</b></div>
  </div>
</template>

<script>
  import SimpleCard from "../../commons/SimpleCard";
  import Price from "../../commons/PriceElement"
  import ErrorsComponent from '../../commons/Errors'

  export default {
    name: "OrderDataSummary",
    props: [
      "order",
    ],
    methods: {
      timeOfDeliveryOrNA() {
        if (this.order.timeOfDelivery != null) {
          return this.order.timeOfDelivery
        } else {
          return "As ASAP as possible"
        }
      },
    },
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