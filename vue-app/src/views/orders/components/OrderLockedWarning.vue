<template>
  <v-banner>
    <v-icon slot="icon" color="warning" size="36">
      mdi-lock-alert
    </v-icon>

    <p><strong>The order is locked!</strong></p>

    <p>
      The order is locked in ordering state and the order entries are
      freezed.<br/>
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
import { Prop } from 'vue-property-decorator';
import Component from 'vue-class-component';
import Vue from 'vue';
import router from '../../../router/index';
import ErrorHandler from '@/lib/ErrorHandler';
import OrdersApiConnector from '@/lib/api/OrdersApiConnector';

@Component({})
export default class OrderLockedWarning extends Vue {
  @Prop() orderId!: string;

  ordersConnector = new OrdersApiConnector()

  placeOrder() {
    router.push({ name: 'OrderView', params: { id: this.orderId } });
  }

  unlockOrder() {
    this.ordersConnector
      .setOrderAsCreated(this.orderId)
      .then(() => {
        this.$store.commit('setLoadingTrue');
        this.$store.dispatch('showOrder/fetchOrderDataAction', this.$store.state.showOrder.order.id);
      })
      .catch((errResponse) => ErrorHandler.handleError(errResponse));
  }
}
</script>

<style scoped></style>
