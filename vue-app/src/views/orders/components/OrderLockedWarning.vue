<template>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-alert :value="true" color="warning"
                     icon="new_releases" outline>
              <p><strong>The order is locked!</strong></p>

              <p>
                The order is locked in ordering state and the order entries are freezed.<br/>
                If you are not ordering yet, click button to go back to created state.
              </p>

              <p>
                <v-btn color="success" @click="unlockOrder()">
                  Unlock&nbsp;&nbsp;<span class="fa fa-unlock"></span>
                </v-btn>

                <v-btn color="success" @click="placeOrder()">
                  Place order&nbsp;&nbsp;<span class="fa fa-arrow-right"></span>
                </v-btn>
              </p>
            </v-alert>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
  import router from '../../../router/index'
  import {
    UNLOCK_ORDER_ACTION,
    FETCH_ORDER_DATA_ACTION,
    NAMESPACE_SHOW_ORDER,
    SET_ORDER_AS_DELIVERED_ACTION,
  } from "../../../store/modules/ShowOrderState"

  export default {
    name: "OrderLockedWarning",
    props: ["orderId"],
    methods: {
      placeOrder() {
        router.push("/orders/" + this.orderId + "/order_view")
      },
      unlockOrder() {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${UNLOCK_ORDER_ACTION}`, {orderId: this.orderId})
      },
    }
  }
</script>

<style scoped>

</style>