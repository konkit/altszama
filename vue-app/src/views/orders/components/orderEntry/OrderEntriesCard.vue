<template>
  <v-card :key="entryId">
    <v-card-title>
      {{orderEntry.username}}
    </v-card-title>

    <v-card-text>
      <PaymentStatus :order="order" :order-entry="orderEntry"
                     :current-user-id="currentUserId" :cost-for-user="orderEntry.finalPrice"></PaymentStatus>

      <v-list dense>
        <template v-for="(dishEntry, dishEntryIndex) in orderEntry.dishEntries">
          <v-list-item :key="dishEntryIndex">

            <v-list-item-content class="index-element">
              <div style="padding-top: 8px;">
                <div style="min-height: 40px;">
                  <div style="padding-top: 8px">
                    <div style="line-height: 36px;">
                      {{dishEntryIndex + 1}}.
                    </div>
                  </div>
                </div>
              </div>

            </v-list-item-content>

            <v-list-item-content>
              <template v-if="isEntryEdited === true && dishEntryId === dishEntry.id">
                <edit-order-entry
                    :order-entry="orderEntry"
                    :dish-entry="dishEntry"
                    :key="dishEntry.id">
                </edit-order-entry>

              </template>
              <template v-else>
                <show-order-entry
                    :order-entry="orderEntry"
                    :dish-entry="dishEntry"
                    :current-user-id="currentUserId"
                    :key="dishEntry.id"
                    :index="dishEntryIndex + 1">
                </show-order-entry>
              </template>
            </v-list-item-content>
          </v-list-item>

          <template v-if="dishEntryIndex < orderEntry.dishEntries.length - 1">
            <v-divider  :key="dishEntryIndex" class="dishes-divider"></v-divider>
          </template>

        </template>

        <template v-if="order.orderState === 'CREATED' && isOrderEntryOwner(orderEntry) && isEntryEdited === false">

          <v-list-item>

            <v-list-item-content class="index-element">
              <div class="py-4">
                {{orderEntry.dishEntries.length + 1}}.
              </div>
            </v-list-item-content>

            <v-list-item-content>
              <div v-if="isEntryCreating === false">
                <v-btn text @click="createEntry()">
                  Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
                </v-btn>
              </div>
              <div v-if="isEntryCreating === true">
                <create-order-entry></create-order-entry>
              </div>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <span class="px-2">
        <b>Cost for user:
          <price :data-price="orderEntry.finalPrice"/>
        </b>
      </span>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Price from '../../../commons/PriceElement.vue'
  import CreateOrderEntry from './CreateOrderEntry.vue'
  import EditOrderEntry from './EditOrderEntry.vue'
  import ShowOrderEntry from './ShowOrderEntry.vue'
  import {mapState} from 'vuex'
  import {
    NAMESPACE_MODIFY_ORDER_ENTRY,
    SET_DISH_ENTRY_CREATING,
  } from "../../../../store/modules/ModifyOrderEntryState";
  import PaymentStatus from "../PaymentStatus";

  export default {
    name: "OrderEntriesCard",
    props: ["order", "orderEntry", "entryId", "currentUserId"],
    methods: {
      isOrderEntryOwner(orderEntry) {
        return orderEntry.userId === this.currentUserId
      },
      paymentStatus(orderEntry) {
        if (orderEntry.paymentStatus === "UNPAID") {
          return "Unpaid"
        } else if (orderEntry.paymentStatus === "MARKED") {
          return "Marked as paid"
        } else if (orderEntry.paymentStatus === "CONFIRMED") {
          return "Payment confirmed"
        } else {
          return orderEntry.paymentStatus
        }
      },
      createEntry() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_CREATING}`, {})
      },
    },
    computed: {
      ...mapState('modifyOrderEntry', [
        "isEntryCreating",
        "isEntryEdited",
        "orderEntryId",
        "dishEntryId",
      ])
    },
    components: {
      PaymentStatus,
      Price,
      CreateOrderEntry,
      EditOrderEntry,
      ShowOrderEntry
    }
  }
</script>

<style scoped>
  .index-element {
    min-width: 20px;
    flex-grow: 0;
    align-self: flex-start;
  }

  .dishes-divider {
    margin-left: 54px;
    max-width: calc(100% - 54px);
  }
</style>