<template>
  <div>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Who will order?
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <!--<v-list-item-title>-->
            {{ this.order.orderCreatorUsername }}
          <!--</v-list-item-title>-->
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>When?</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <!--<v-list-item-title>-->
            {{ this.order.timeOfOrder }}
          <!--</v-list-item-title>-->
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>When it'll arrive?</v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
          <!--<v-list-item-title>-->
          {{ this.timeOfDeliveryOrNA() }}
          <!--</v-list-item-title>-->
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
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
    }
  }
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 125px 1fr;
  }
</style>