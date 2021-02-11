<template>
  <div>
    <h3>Price change</h3>

    <v-text-field
        class="percent-input"
        label="Price decrease (in percent)"
        suffix="%"
        :value="priceModifiers.decreaseInPercent"
        @input="updateDecreaseInPercent($event)"
    ></v-text-field>

    <MoneyInput
        class="short-input"
        label="Delivery cost (total)"
        :value="priceModifiers.deliveryCostPerEverybody"
        @input="updateDeliveryCostPerEverybody($event)"
    >
    </MoneyInput>

    <MoneyInput
        class="short-input"
        label="Delivery cost (per dish)"
        :value="priceModifiers.deliveryCostPerDish"
        @input="updateDeliveryCostPerDish($event)"
    >
    </MoneyInput>
  </div>
</template>

<script lang="ts">
import MoneyInput from "@/views/commons/MoneyInput.vue"
import {PriceModifierFieldsValue} from "@/views/orders/components/orderCreateForm/model";
import Vue from "vue";
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
  components: {MoneyInput}
})
export default class PriceModifiersFields extends Vue {
  @Prop() priceModifiers: PriceModifierFieldsValue

  updateDecreaseInPercent(newValue: number) {
    this.$emit("input", Object.assign(this.priceModifiers, {decreaseInPercent: newValue}))
  }

  updateDeliveryCostPerEverybody(newValue: number) {
    this.$emit("input", Object.assign(this.priceModifiers, {deliveryCostPerEverybody: newValue}))
  }

  updateDeliveryCostPerDish(newValue: number) {
    this.$emit("input", Object.assign(this.priceModifiers, {deliveryCostPerDish: newValue}))

  }
}
</script>

<style scoped>

.percent-input {
  width: 150px;
}

.short-input {
  width: 200px;
}
</style>
