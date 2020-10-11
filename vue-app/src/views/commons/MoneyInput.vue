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
import { Prop, Watch } from "vue-property-decorator";

@Component({})
export default class MoneyInput extends Vue {
  @Prop({ default: "Price" }) label!: string;
  @Prop() value!: number;
  @Prop({ default: "zł" }) currency!: string;

  stringValue = "";
  newStringValue = "";

  mounted() {
    const newValue = this.calcNewValue(this.value, this.currency);

    this.stringValue = newValue;
    this.newStringValue = newValue;
  }

  onInput(event: string) {
    this.newStringValue = event;
  }

  onBlur() {
    this.$emit("input", fromString(this.newStringValue));
  }

  @Watch("value")
  onPropertyChanged(newVal: number) {
    const newValue = this.calcNewValue(newVal, this.currency);

    this.stringValue = newValue;
    this.newStringValue = newValue;
  }

  private calcNewValue(newVal: number, currency: string): string {
    let newValue = 0;

    if (newVal) {
      newValue = newVal;
    }

    const wholePart = Math.floor(newValue / 100);
    const fractionPart = ("0" + (newValue % 100)).slice(-2);

    return `${wholePart},${fractionPart} ${currency}`;
  }
}

function fromString(a: string) {
  if (!a) {
    return 0;
  }

  const str = a.split(",");

  if (str.length === 0) {
    return 0;
  }

  if (str.length === 1) {
    return parseInt(str[0]) * 100;
  }

  const wholePart = parseInt(str[0].trim()) * 100;

  const fractionPartString = str[1].trim();
  let fractionPart = 0;
  if (fractionPartString.length === 0) {
    fractionPart = 0;
  } else if (fractionPartString.length === 1) {
    fractionPart = parseInt(fractionPartString) * 10;
  } else {
    fractionPart = parseInt(str[1].trim().substr(0, 2));
  }

  return wholePart + fractionPart;
}
</script>

<style scoped></style>
