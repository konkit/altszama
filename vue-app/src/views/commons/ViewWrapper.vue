<template>
  <v-container fluid class="simple-card">
    <v-layout align-center justify-center>
      <v-flex xs10 xl8>
        <v-card class="card-toolbar">
          <v-toolbar flat>
            <slot name="toolbar"></slot>
          </v-toolbar>

          <v-card-text>
            <v-layout column>
              <v-content>
                <slot></slot>
              </v-content>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "ViewWrapper"
  }
</script>

<style scoped>
  .simple-card {
    max-width: 1500px;
  }

  .card-toolbar {
    margin-top: -88px;
  }
</style>