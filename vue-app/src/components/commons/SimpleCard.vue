<template>
  <v-container fluid>
    <v-layout align-center justify-center>
      <v-flex xs10 xl8>
        <v-card>
          <v-card-text>
            <v-layout column>
              <slot></slot>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'SimpleCard',
  }
</script>

<style scoped>
</style>
