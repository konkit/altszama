<template>
  <v-container fluid class="simple-card">
    <!--<v-layout align-center justify-center>-->
      <!--&lt;!&ndash;<v-flex xs10 xl8>&ndash;&gt;-->
      <!--<v-flex xs12>-->
        <!--<v-card>-->
          <!--<v-card-text>-->
    <v-row>
      <v-col cols="xs12">
        <v-card>
          <v-card-text>
            <slot></slot>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'SimpleCard',
  }
</script>

<style scoped>
  .simple-card {
    max-width: 1500px;
  }
</style>
