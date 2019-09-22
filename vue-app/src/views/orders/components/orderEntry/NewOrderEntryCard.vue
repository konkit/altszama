<template>
  <v-card>
    <v-card-title>
      {{username}}
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

<script>
  import {
    DELETE_DISH_ENTRY_ACTION,
    UNLOCK_ORDER_ACTION,
    FETCH_ORDER_DATA_ACTION,
    NAMESPACE_SHOW_ORDER,
    SET_ORDER_AS_CREATED_ACTION,
    SET_ORDER_AS_ORDERED_ACTION,
    SET_ORDER_AS_DELIVERED_ACTION,
    SET_ORDER_AS_REJECTED_ACTION,
    DELETE_ORDER_ACTION,
  } from "../../../../store/modules/ShowOrderState"
  import {
    SET_DISH_ENTRY_CREATING,
    SET_DISH_ENTRY_EDITING,
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY,
  } from "../../../../store/modules/ModifyOrderEntryState";
  import CreateOrderEntry from "./CreateOrderEntry";

  export default {
    name: "NewOrderEntryCard",
    props: ["username", "isEntryCreating"],
    methods: {
      createEntry() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_CREATING}`, {})
      },
    },
    components: {
      CreateOrderEntry
    }
  }
</script>

<style scoped>

</style>