<template>
  <div :key="'entryId-' + entryId">

    <v-divider class="py-2"></v-divider>

    <TitleWithPaymentStatus
        :title="orderEntry.username"
        :price-for-user="orderEntry.finalPrice"
        :order="order"
        :order-entry="orderEntry"
        :current-user-id="currentUserId"
        :cost-for-user="orderEntry.finalPrice"
    ></TitleWithPaymentStatus>

    <v-list dense>
      <template v-for="(dishEntry, dishEntryIndex) in orderEntry.dishEntries">
        <v-list-item :key="'dishEntry-' + dishEntryIndex">
          <v-list-item-content>
            <template v-if="isEntryEdited === true && dishEntryId === dishEntry.id">
              <edit-order-entry
                  :order-entry="orderEntry"
                  :dish-entry="dishEntry"
                  :key="'edit-order-entry-' + dishEntry.id"
              >
              </edit-order-entry>
            </template>
            <template v-else>
              <show-order-entry
                  :order-entry="orderEntry"
                  :dish-entry="dishEntry"
                  :current-user-id="currentUserId"
                  :key="'show-order-entry-' + dishEntry.id"
                  :index="dishEntryIndex + 1"
              >
              </show-order-entry>
            </template>
          </v-list-item-content>
        </v-list-item>

        <template v-if="dishEntryIndex < orderEntry.dishEntries.length - 1">
          <v-divider :key="'dish-entry-divider' + dishEntryIndex" class="dishes-divider"></v-divider>
        </template>
      </template>

      <template v-if="canAddNewEntry()">
        <v-list-item>
          <v-list-item-content>
            <div v-if="isEntryCreating === false">
              <v-btn color="primary ml-4" @click="createEntry()">
                Add entry<i class="fa fa-plus ml-2" aria-hidden="true"></i>
              </v-btn>
            </div>
            <div v-if="isEntryCreating === true">
              <create-order-entry></create-order-entry>
            </div>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import Price from "../../../commons/PriceElement.vue";
import CreateOrderEntry from "./CreateOrderEntry.vue";
import EditOrderEntry from "./EditOrderEntry.vue";
import ShowOrderEntry from "./ShowOrderEntry.vue";
import TitleWithPaymentStatus from "@/views/orders/components/TitleWithPaymentStatus.vue";
import Vue from "vue";
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import {ParticipantsOrderEntry, ShowOrderDto} from "../../../../frontend-client";
import OrderStateEnum = ShowOrderDto.OrderStateEnum;

@Component({
  components: {
    TitleWithPaymentStatus,
    Price,
    CreateOrderEntry,
    EditOrderEntry,
    ShowOrderEntry
  }
})
export default class OrderEntriesCard extends Vue {
  @Prop() order!: ShowOrderDto;
  @Prop() orderEntry!: ParticipantsOrderEntry;
  @Prop() entryId!: string;
  @Prop() currentUserId!: string;

  isOrderEntryOwner() {
    return this.orderEntry.userId === this.currentUserId;
  }

  createEntry() {
    this.$store.commit(`modifyOrderEntry/setDishEntryCreating`, {});
  }

  get isEntryCreating() {
    return this.$store.state.modifyOrderEntry.isEntryCreating;
  }

  get isEntryEdited() {
    return this.$store.state.modifyOrderEntry.isEntryEdited;
  }

  get dishEntryId() {
    return this.$store.state.modifyOrderEntry.dishEntryId;
  }

  canAddNewEntry() {
    return this.order.orderState === OrderStateEnum.CREATED && this.isOrderEntryOwner() && !this.isEntryEdited
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
  margin-left: 16px;
  max-width: calc(100% - 16px);
}
</style>
