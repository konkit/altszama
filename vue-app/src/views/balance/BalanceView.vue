<template>
  <div>
    <ViewWrapper>
      <LoadingView>
        <v-container>
          <v-row>
            <v-col cols="xs12">
              <h1 class="mb-4">Your balance:</h1>
              <template v-if="owedMoneyEntries.length === 0">
                <p>No pending entries - all settled up.</p>
              </template>

              <template v-if="owedMoneyEntries.length > 0">
                <v-list>
                  <template v-for="([owedUsername, owedAmount], i) in owedMoneyEntries">
                    <template v-if="owedAmount !== 0">
                      <v-list-item two-line :key="i">
                        <v-list-item-content>
                          <v-list-item-title>
                            <template v-if="owedAmount > 0">
                              <p :key="i">You are owed <b><price-element :data-price="owedAmount"/></b> by <b>{{owedUsername}}</b></p>
                            </template>

                            <template v-if="owedAmount < 0">
                              <p :key="i">You owe <b><price-element :data-price="-owedAmount" /></b> to <b>{{owedUsername}}</b></p>
                            </template>
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </template>
                </v-list>
              </template>

              <h1 class="mb-4">Your order history:</h1>

              <template v-if="orderHistoryEntries.length > 0">
                <v-list>
                  <template v-for="historyEntry in orderHistoryEntries">
                    <template v-if="historyEntry.kind === 'createdEntry'">
                      <CreatedEntryComponent :history-entry="historyEntry" :key="historyEntry.orderId"/>
                    </template>

                    <template v-if="historyEntry.kind === 'participatedEntry'">
                      <ParticipatedEntryComponent :history-entry="historyEntry" :key="historyEntry.orderId"/>
                    </template>
                  </template>
                </v-list>
              </template>

              <template v-if="orderHistoryEntries.length === 0">
                <p>Your order history is empty.</p>
              </template>
            </v-col>
          </v-row>
        </v-container>
      </LoadingView>
    </ViewWrapper>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Navigation from "../commons/Navigation.vue";
import ViewWrapper from "../commons/ViewWrapper.vue";
import LoadingView from "../commons/LoadingView.vue";
import Vue from "vue";
import BalanceApiConnector from "@/lib/api/BalanceApiConnector";
import {OrderHistoryCreatedEntry, OrderHistoryParticipatedEntry} from "@/frontend-client";
import PriceElement from "@/views/commons/PriceElement.vue";
import CreatedEntryComponent from "@/views/balance/components/CreatedEntryComponent.vue";
import ParticipatedEntryComponent from "@/views/balance/components/ParticipatedEntryComponent.vue";

@Component({
  components: {
    CreatedEntryComponent,
    ParticipatedEntryComponent,
    PriceElement,
    Navigation,
    ViewWrapper,
    LoadingView
  }
})
export default class BalanceView extends Vue {
  connector: BalanceApiConnector = new BalanceApiConnector();

  orderHistoryEntries: (OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry)[] = []
  owedMoneyEntries: [string, number][] = []

  mounted() {
    this.connector.getBalanceForUser()
        .then(response => {
          this.orderHistoryEntries = response.entries
          this.owedMoneyEntries = Object.entries(response.owedMoney)

          this.$store.commit("setTitle", "Your order history")
          this.$store.commit("setLoadingFalse");
        })
  }

  goToOrder(orderId: string) {
    console.log("Go to orderId", orderId)
  }
}
</script>

<style scoped>
</style>
