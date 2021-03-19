<template>
  <div>
    <h3>{{username }}</h3>

      <div class="user-order-col">
        <template v-if="isEntryCreating === false">
          <v-btn color="primary" class="mt-3" @click="createEntry()">
            Add entry &nbsp;<i class="fa fa-plus" aria-hidden="true"></i>
          </v-btn>
        </template>

        <template v-if="isEntryCreating === true">
          <create-order-entry></create-order-entry>
        </template>
      </div>
  </div>
</template>

<script lang="ts">
import CreateOrderEntry from "@/views/orders/components/orderEntry/CreateOrderEntry.vue";
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({
  components: {
    CreateOrderEntry
  }
})
export default class NewOrderEntryCard extends Vue {
  @Prop() username!: string;
  @Prop() isEntryCreating!: boolean;

  createEntry() {
    this.$store.commit(`modifyOrderEntry/setDishEntryCreating`,{});
  }
}
</script>

<style scoped></style>
