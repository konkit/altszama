<template>
  <v-text-field
      @input="onInput($event)"
      @blur="onBlur()"
      :label="label"
      :value="stringValue"
  >
  </v-text-field>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop} from "vue-property-decorator";

  @Component({
    watch: {
      value(newVal) {
        const newValue = calcNewValue(newVal, this.currency);

        this.stringValue = newValue;
        this.newStringValue = newValue;
      }
    }
  })
  export default class MoneyInput extends Vue {
    @Prop() label: string = "Price";
    @Prop() value: number;
    @Prop() currency: string = "zł";

    private stringValue: "";
    private newStringValue: "";

    mounted() {
      const newValue = calcNewValue(this.value, this.currency);

      this.stringValue = newValue;
      this.newStringValue = newValue;
    }

    onInput(event) {
      this.newStringValue = event;
    }

    onBlur() {
      this.$emit("input", fromString(this.newStringValue))
    }
  }

  function calcNewValue(newVal, currency) {
    let newValue = 0;

    if (newVal) {
      newValue = newVal;
    }

    let wholePart = Math.floor(newValue / 100);
    let fractionPart = ("0" + (newValue % 100)).slice(-2);

    return `${wholePart},${fractionPart} ${currency}`
  }

  function fromString(a) {
    if (!a) {
      return 0;
    }

    let str = a.split(",");

    if (str.length === 0) {
      return 0;
    }

    if (str.length === 1) {
      return parseInt(str[0]) * 100
    }

    const wholePart = parseInt(str[0].trim() * 100);

    const fractionPartString = str[1].trim();
    let fractionPart = 0;
    if (fractionPartString.length === 0) {
      fractionPart = 0;
    } else if (fractionPartString.length === 1) {
      fractionPart = parseInt(fractionPartString) * 10
    } else {
      fractionPart = parseInt(str[1].trim().substr(0, 2));
    }

    return wholePart + fractionPart;
  }
</script>

<style scoped>

</style>