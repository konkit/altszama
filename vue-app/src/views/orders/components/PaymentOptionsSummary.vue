<template>
  <div>
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <span v-if="paymentData.paymentByCash === true" class="payment-entry">
            <v-chip color="green" text-color="white">
              Payment by cash &nbsp; <span class="fa fa-check ml-2"></span>
            </v-chip>
          </span>
          <span v-if="paymentData.paymentByCash === false" class="payment-entry">
            <v-chip color="red" text-color="white">
              Payment by cash &nbsp; <span class="fa fa-times ml-2"></span>
            </v-chip>
          </span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <span
            v-if="paymentData.paymentByBankTransfer === true"
            class="payment-entry"
          >
            <v-chip color="green" text-color="white">
              Payment by bank transfer <span class="fa fa-check ml-2"></span>
            </v-chip>
          </span>
          <span
            v-if="paymentData.paymentByBankTransfer === false"
            class="payment-entry"
          >
            <v-chip color="red" text-color="white">
              Payment by bank transfer <span class="fa fa-times ml-2"></span>
            </v-chip>
          </span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="paymentData.paymentByBankTransfer">
        <v-list-item-content>
          <div class="px-3 user-selectable">
            {{ formatBankAccountNr(paymentData.bankTransferNumber) }}
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <span v-if="paymentData.paymentByBlik === true" class="payment-entry">
            <v-chip color="green" text-color="white">
              Payment by BLIK &nbsp; <span class="fa fa-check ml-2"></span>
            </v-chip>
          </span>
          <span v-if="paymentData.paymentByBlik === false" class="payment-entry">
            <v-chip color="red" text-color="white">
              Payment by BLIK &nbsp; <span class="fa fa-times ml-2"></span>
            </v-chip>
          </span>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="paymentData.paymentByBankTransfer">
        <v-list-item-content>
          <div class="px-3 user-selectable">
            {{ formatBlikPhoneNumber(paymentData.blikPhoneNumber) }}
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import Component from "vue-class-component";
import { PaymentData } from "@/frontend-client";

@Component({})
export default class PaymentOptionsSummary extends Vue {
  // @Prop() order;
  @Prop() paymentData!: PaymentData;

  formatBankAccountNr(unformattedInput: string) {
    if (unformattedInput) {
      const input = unformattedInput.trim();

      if (input.length === 26) {
        let result = input.slice(0, 2) + " ";

        for (let i = 2; i < input.length; i += 4) {
          result += input.slice(i, i + 4) + " ";
        }

        return result;
      }
    }

    return unformattedInput;
  }

  formatBlikPhoneNumber(unformattedInput: string) {
    if (unformattedInput) {
      const input = unformattedInput.trim();

      if (input.length >= 9) {
        return `${input.slice(0, input.length - 6)} ${input.slice(
          input.length - 6,
          input.length - 3
        )} ${input.slice(input.length - 3, input.length)}`;
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
