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
    NAMESPACE_MODIFY_ORDER_ENTRY,
    SET_DISH_ENTRY_CREATING,
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