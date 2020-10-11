<template>
  <v-dialog v-model="dialog" width="350">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">
        Bank transfer QR &nbsp; <v-icon>fa-qrcode</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title primary-title>
        Bank transfer QR Code
      </v-card-title>

      <div class="text-align-center">
        <qrcode-vue :value="generateCodeValue()" size="300"></qrcode-vue>
      </div>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import QrcodeVue from "qrcode.vue";

function formatName(inputValue) {
  return inputValue
    .replace(/ą/g, "a")
    .replace(/Ą/g, "A")
    .replace(/ć/g, "c")
    .replace(/Ć/g, "C")
    .replace(/ę/g, "e")
    .replace(/Ę/g, "E")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .replace(/ń/g, "n")
    .replace(/Ń/g, "N")
    .replace(/ó/g, "o")
    .replace(/Ó/g, "O")
    .replace(/ś/g, "s")
    .replace(/Ś/g, "S")
    .replace(/ż/g, "z")
    .replace(/Ż/g, "Z")
    .replace(/ź/g, "z")
    .replace(/Ź/g, "Z")
    .toUpperCase();
}

function formatBankTransferNumber(inputValue) {
  return inputValue.replace(/ /g, "");
}

export default {
  name: "BankTransferQRCode",
  props: ["order", "userOrderAmount"],
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    generateCodeValue() {
      const bankAccountNumber = formatBankTransferNumber(
        this.order.bankTransferNumber
      );

      const amount = this.userOrderAmount;
      const orderCreator = formatName(this.order.orderCreatorUsername);

      const transferTitle = `AltSzama ${this.order.orderDate}`;

      return `||${bankAccountNumber}|${amount}|${orderCreator}|${transferTitle}||ALTSZAMA|PLN`;
    }
  },
  components: {
    QrcodeVue
  }
};
</script>

<style scoped>
.text-align-center {
  text-align: center;
}
</style>
