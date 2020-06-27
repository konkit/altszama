<template>
  <div>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
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
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
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
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="order.paymentByBankTransfer">
        <v-list-item-content>
          <div class="px-3 user-selectable">
            {{ formatBankAccountNr(order.bankTransferNumber) }}
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
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
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="order.paymentByBankTransfer">
        <v-list-item-content>
          <div class="px-3 user-selectable">
            {{ formatBlikPhoneNumber(order.blikPhoneNumber) }}
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Prop} from "vue-property-decorator";
  import Component from "vue-class-component";

  @Component({})
  export default class PaymentOptionsSummary extends Vue {
    @Prop() order;

    formatBankAccountNr(unformattedInput) {
      if (unformattedInput) {
        var input = unformattedInput.trim();

        if (input.length === 26) {
          var result = input.slice(0, 2) + " ";

          for (var i = 2; i < input.length; i += 4) {
            result += input.slice(i, i + 4) + " "
          }

          return result;
        }
      }

      return unformattedInput;
    }

    formatBlikPhoneNumber(unformattedInput) {
      if (unformattedInput) {
        var input = unformattedInput.trim();

        if (input.length >= 9) {
          return `${input.slice(0, input.length - 6)} ${input.slice(input.length - 6, input.length - 3)} ${input.slice(input.length - 3, input.length)}`
        }
      }

      return unformattedInput;
    }
  }

</script>

<style scoped>
  .user-selectable {
    user-select: text;
  }
</style>