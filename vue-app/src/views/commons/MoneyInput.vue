<template>
  <v-text-field
      @input="onInput($event)"
      @blur="onBlur()"
      :label="label"
      :value="stringValue"
  >
  </v-text-field>
</template>

<script>
  export default {
    name: "MoneyInput",
    props: {
      label: {
        type: String,
        default: "Price"
      },
      value: {
        type: Number
      },
      currency: {
        type: String,
        default: "zł"
      }
    },
    data() {
      return {
        stringValue: "",
        newStringValue: "",
      }
    },
    mounted() {
      const newValue = calcNewValue(this.value, this.currency);

      this.stringValue = newValue;
      this.newStringValue = newValue;
    },
    methods: {
      onInput(event) {
        this.newStringValue = event;
      },
      onBlur() {
        this.$emit("input", fromString(this.newStringValue))
      }
    },
    watch: {
      value(newVal) {
        const newValue = calcNewValue(newVal, this.currency);

        this.stringValue = newValue;
        this.newStringValue = newValue;
      }
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

    let str = a.split(",")

    if (str.length == 0) {
      return 0;
    }

    if (str.length == 1) {
      return parseInt(str[0]) * 100
    }

    return parseInt(str[0]) * 100 + parseInt(str[1]);
  }
</script>

<style scoped>

</style>