<template>
  <v-card>
    <v-card-title>
      {{ username }}
    </v-card-title>

    <v-card-text>
      <div class="user-order-col">
        <template v-if="isEntryCreating === false">
          <v-btn color="success" @click="createEntry()">
            Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
          </v-btn>
        </template>

        <template v-if="isEntryCreating === true">
          <create-order-entry></create-order-entry>
        </template>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  NAMESPACE_MODIFY_ORDER_ENTRY,
  SET_DISH_ENTRY_CREATING
} from "@/store/modules/ModifyOrderEntryModule";
import CreateOrderEntry from "@/views/orders/components/orderEntry/CreateOrderEntry.vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  components: {
    CreateOrderEntry
  }
})
export default class NewOrderEntryCard extends Vue {
  @Prop() username!: string;
  @Prop() isEntryCreating!: boolean;

  createEntry() {
    this.$store.commit(
      `${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_CREATING}`,
      {}
    );
  }
}
</script>

<style scoped></style>
