<template>
  <v-banner>
    <v-icon slot="icon" color="warning" size="36">
      mdi-lock-alert
    </v-icon>

    <p><strong>The order is locked!</strong></p>

    <p>
      The order is locked in ordering state and the order entries are
      freezed.<br />
      If you are not ordering yet, click button to go back to created state.
    </p>

    <template v-slot:actions>
      <v-btn text color="primary" @click="unlockOrder()">
        Unlock &nbsp; <span class="fa fa-unlock"></span>
      </v-btn>
      <v-btn text color="primary" @click="placeOrder()">
        Place order &nbsp; <span class="fa fa-arrow-right"></span>
      </v-btn>
    </template>
  </v-banner>
</template>

<script lang="ts">
import router from "../../../router/index";
import {
  NAMESPACE_SHOW_ORDER,
  UNLOCK_ORDER_ACTION
} from "../../../store/modules/ShowOrderModule";
import { Prop } from "vue-property-decorator";
import Component from "vue-class-component";
import Vue from "vue";

@Component({})
export default class OrderLockedWarning extends Vue {
  @Prop() orderId!: string;

  placeOrder() {
    router.push("/orders/" + this.orderId + "/order_view");
  }

  unlockOrder() {
    this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${UNLOCK_ORDER_ACTION}`, {
      orderId: this.orderId
    });
  }
}
</script>

<style scoped></style>
