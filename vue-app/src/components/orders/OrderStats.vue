<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-4">
        <h3>Order data</h3>

        <dt>Who will order?</dt>
        <dd>{{ this.order.orderCreatorUsername }}</dd>

        <dt>When?</dt>
        <dd>{{ this.order.timeOfOrder }}</dd>

        <dt>When it'll arrive?</dt>
        <dd>{{ this.timeOfDeliveryOrNA() }}</dd>
      </div>

      <div class="col-4">
        <h3>Price modifiers</h3>

        <dt>Price decrease</dt>
        <dd>{{ this.order.decreaseInPercent }} %</dd>

        <dt>Delivery cost (total)</dt>
        <dd>
          <price :data-price="this.order.deliveryCostPerEverybody"/>
        </dd>

        <dt>Delivery cost (per dish)</dt>
        <dd>
          <price :data-price="this.order.deliveryCostPerDish"/>
        </dd>
      </div>

      <div class="col-4">
        <h3>Payment</h3>

        <p v-if="this.order.paymentByCash == true">
          <b class="allowed">
            Payment by cash
            <span class="fa fa-check"></span>
          </b>
        </p>
        <p v-if="this.order.paymentByCash == false">
          <b class="not-allowed">
            Payment by cash
            <span class="fa fa-times"></span>
          </b>
        </p>

        <p v-if="this.order.paymentByBankTransfer == true">
          <b class="allowed">
            Payment by bank transfer
            <span class="fa fa-check"></span>
          </b>
        </p>
        <p v-if="this.order.paymentByBankTransfer == false">
          <b class="not-allowed">
            Payment by bank transfer
            <span class="fa fa-times"></span>
          </b>
        </p>

        <dt v-if="order.paymentByBankTransfer">Bank transfer number</dt>
        <dd v-if="order.paymentByBankTransfer">{{ order.bankTransferNumber }}</dd>
      </div>

    </div>

    <div class="row justify-content-center" v-if="isNotOrderedYet()">
      <div class="col">
        <p>
          <b>Link to menu:</b>
          <a target="_blank" :href="order.restaurantUrl">{{order.restaurantUrl}}</a>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
  import Price from '../commons/PriceElement.vue'
  import {mapState} from "vuex"

  export default {
    methods: {
      timeOfDeliveryOrNA () {
        if (this.order.timeOfDelivery != null) {
          return this.order.timeOfDelivery
        } else {
          return "As ASAP as possible"
        }
      },
      isNotOrderedYet () {
        return this.order.orderState === 'CREATED';
      },
    },
    computed: {
      ...mapState('showOrder', [
        "order",
        "totalOrderPrice",
      ])
    },
    components: {
      Price,
    }
  }
</script>

<style scoped>
  .row {
    margin-top: 2rem;
  }

  .allowed {
    color: green;
  }

  .not-allowed {
    color: red;
  }
</style>

