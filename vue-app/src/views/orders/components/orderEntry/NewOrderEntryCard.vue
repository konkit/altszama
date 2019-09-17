<template>
  <simple-card>
    <div>
      <div class="pa-2">
        <div>
          <b>{{username}}</b>
        </div>
      </div>

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
    </div>
  </simple-card>
</template>

<script>
  export default {
    name: "NewOrderEntryCard"
  }
</script>

<style scoped>

</style>