<template>
  <div>
  <span v-if="this.order.paymentByCash == true" class="payment-entry">
    <v-chip color="green" text-color="white">
      Payment by cash &nbsp; <span class="fa fa-check"></span>
    </v-chip>
  </span>
    <span v-if="this.order.paymentByCash == false" class="payment-entry">
    <v-chip color="red" text-color="white">
      Payment by cash &nbsp; <span class="fa fa-times"></span>
    </v-chip>
  </span>

    <span v-if="this.order.paymentByBankTransfer == true" class="payment-entry">
    <v-chip color="green" text-color="white">
      Payment by bank transfer &nbsp; <span class="fa fa-check"></span>
    </v-chip>
  </span>
    <span v-if="this.order.paymentByBankTransfer == false" class="payment-entry">
    <v-chip color="red" text-color="white">
      Payment by bank transfer &nbsp; <span class="fa fa-times"></span>
    </v-chip>
  </span>

    <span v-if="this.order.paymentByBlik == true" class="payment-entry">
    <v-chip color="green" text-color="white">
      Payment by BLIK &nbsp; <span class="fa fa-check"></span>
    </v-chip>
  </span>
    <span v-if="this.order.paymentByBlik == false" class="payment-entry">
    <v-chip color="red" text-color="white">
      Payment by BLIK &nbsp; <span class="fa fa-times"></span>
    </v-chip>
  </span>

    <div v-if="order.paymentByBankTransfer">
      Bank transfer number: {{ order.bankTransferNumber }}
    </div>

    <div v-if="order.paymentByBankTransfer">
      BLIK phone number: {{ order.blikPhoneNumber }}
    </div>
  </div>
</template>

<script>
  import SimpleCard from "../../commons/SimpleCard";
  import Price from "../../commons/PriceElement"
  import ErrorsComponent from '../../commons/Errors'

  export default {
    name: "PaymentOptionsSummary",
    props: [
      "order",
    ],
    methods: {},
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