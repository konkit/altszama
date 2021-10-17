<template>
  <div>
    <h3>Payment</h3>

    <v-switch
        :input-value="paymentData.paymentByCash"
        @change="updatePaymentByCash($event)"
        label="Payment by cash"
    ></v-switch>

    <v-switch
        :input-value="paymentData.paymentByBankTransfer"
        @change="updatePaymentByBankTransfer($event)"
        label="Payment by bank transfer"
    ></v-switch>

    <v-text-field
        v-if="paymentData.paymentByBankTransfer"
        label="Bank transfer number"
        :value="paymentData.bankTransferNumber"
        @change="updateBankTransferNumber($event)"
    >
    </v-text-field>

    <v-switch
        :input-value="paymentData.paymentByBlik"
        @change="updatePaymentByBlik($event)"
        label="Payment by BLIK"
    ></v-switch>

    <v-text-field
        v-if="paymentData.paymentByBlik"
        label="BLIK phone number"
        :value="paymentData.blikPhoneNumber"
        @change="updateBlikPhoneNumber($event)"
    >
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { PaymentDataFieldsValue } from '@/views/orders/components/orderCreateForm/model';
import MoneyInput from '@/views/commons/MoneyInput.vue';

@Component({
  components: { MoneyInput },
})
export default class PaymentDataFields extends Vue {
  @Prop() paymentData: PaymentDataFieldsValue

  updatePaymentByCash(newValue: string) {
    this.$emit('input', Object.assign(this.paymentData, { paymentByCash: newValue }));
  }

  updatePaymentByBankTransfer(newValue: string) {
    this.$emit('input', Object.assign(this.paymentData, { paymentByBankTransfer: newValue }));
  }

  updatePaymentByBlik(newValue: string) {
    this.$emit('input', Object.assign(this.paymentData, { paymentByBlik: newValue }));
  }

  updateBankTransferNumber(newValue: string) {
    this.$emit('input', Object.assign(this.paymentData, { bankTransferNumber: newValue }));
  }

  updateBlikPhoneNumber(newValue: string) {
    this.$emit('input', Object.assign(this.paymentData, { blikPhoneNumber: newValue }));
  }
}
</script>

<style scoped>

</style>
